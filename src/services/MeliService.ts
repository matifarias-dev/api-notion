import axios, { type AxiosResponse, type RawAxiosRequestHeaders } from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type MeliToken from '../entities/MeliToken'
import type {
  ItemDetailResponse,
  MeliNotionItem,
  MeliNotionTable,
  MeliOrderFilter,
  MeliOrderResponse,
  MeliTokenResponse,
  OrderDetails,
  ShippingResponse
} from '../interfaces/meli.interface'
import { toMeliToken } from '../mappers/meli.mapper.'
import MeliTokenRepository from '../repositories/MeliTokenRepository'
import {
  BASE_URL_MELI,
  CUTOFF_T,
  GRANT_TYPE,
  LOGISTIC_TYPE,
  TIME_THRESHOLD
} from '../utils/constants'
import { OrderStatus, ShippingStatus } from '../utils/enums'
import {
  APP_ID_MELI,
  CLIENT_SECRET_MELI,
  MELI_USER_ID,
  REDIRECT_MELI_URL
} from '../utils/env'
import { logger } from '../utils/logger'

dayjs.extend(utc)
const meliTokenRepository = new MeliTokenRepository()

export default class MeliService {
  public readonly getAuthURL = (): string =>
    `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID_MELI}&redirect_uri=${REDIRECT_MELI_URL}`

  private readonly getHeader = async (): Promise<RawAxiosRequestHeaders> => {
    return await this.getToken()
      .then((token) => {
        if (token === null) throw new Error('MeliToken is null')
        return {
          Authorization: 'Bearer ' + token.accessToken
        }
      })
      .catch((err) => {
        logger.error(err)
        throw new Error('Error getting header')
      })
  }

  private readonly getOrderDetailURL = (orderId: number): string => {
    const url = `${BASE_URL_MELI}/orders/` + orderId
    logger.info(url)
    return url
  }

  private readonly getShippingDetailURL = (orderId: number): string => {
    const url = `${BASE_URL_MELI}/orders/${orderId}/shipments`
    logger.info(url)
    return url
  }

  private readonly getItemDetailURL = (itemId: string): string => {
    const url = `${BASE_URL_MELI}/items/${itemId}`
    logger.info(url)
    return url
  }

  async changeCodeForToken (code?: string): Promise<MeliToken> {
    try {
      const response: AxiosResponse<MeliTokenResponse> = await axios.post(
        `${BASE_URL_MELI}/oauth/token`,
        {
          grant_type: GRANT_TYPE.authorization,
          client_id: APP_ID_MELI,
          client_secret: CLIENT_SECRET_MELI,
          code,
          redirect_uri: REDIRECT_MELI_URL
        }
      )

      const dataStored = await this.getToken()
      console.log(dataStored)
      if (dataStored === null) {
        logger.info('Saving new token')
        return await meliTokenRepository.saveMeliToken(
          toMeliToken(response.data)
        )
      } else {
        logger.info(`Updating token id: ${String(dataStored._id)}`)
        return await meliTokenRepository.saveMeliToken(
          toMeliToken(response.data, dataStored._id)
        )
      }
    } catch (err) {
      logger.error(err)
      throw new Error('Error saving new token')
    }
  }

  async getToken (): Promise<MeliToken | null> {
    return await meliTokenRepository
      .getMeliToken({ userId: MELI_USER_ID })
      .then(async (token) => {
        if (token === null) {
          throw new Error('Token not found, please try login again')
        }
        if ((await this.getAuthTimeLeft(token)) <= TIME_THRESHOLD) {
          logger.info(`Token expired with id: ${String(token._id)}`)
          return await this.refreshAuth(token)
        }
        logger.info(`Token found for user: ${String(token?.userId)}`)
        return token
      })
      .catch((err) => {
        logger.error(`Error to get a token: ${err}`)
        return null
      })
  }

  async refreshAuth (lastToken: MeliToken): Promise<MeliToken> {
    try {
      const response: AxiosResponse<MeliTokenResponse> = await axios.post(
        'https://api.mercadolibre.com/oauth/token',
        {
          grant_type: GRANT_TYPE.refresh,
          client_id: APP_ID_MELI,
          client_secret: CLIENT_SECRET_MELI,
          refresh_token: lastToken.refreshToken
        }
      )

      return await meliTokenRepository.saveMeliToken(
        toMeliToken(response.data, lastToken._id)
      )
    } catch (err) {
      logger.error(err)
      throw new Error('Error to get a refresh token')
    }
  }

  async getAuthTimeLeft (token?: MeliToken | null): Promise<number> {
    if (token === null || token === undefined) {
      token = await meliTokenRepository.getMeliToken({
        userId: MELI_USER_ID
      })
      if (token === null) return 0
    }
    const now = dayjs()
    return token.getExpireInDateTime().diff(now, 's')
  }

  async getOrders (filter: MeliOrderFilter): Promise<MeliOrderResponse> {
    try {
      const token = await this.getToken()
      if (token === null) {
        throw new Error('MeliToken is null')
      }

      const params = {
        ...Object.fromEntries(
          Object.entries(filter ?? {}).filter(([, value]) => value !== null)
        ),
        seller: token.userId,
        limit: filter?.limit ?? 50
      }
      const response = await axios.get<MeliOrderResponse>(
        `${BASE_URL_MELI}/orders/search`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          },
          params
        }
      )
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        logger.error({
          status: err.response?.status,
          response: err.response?.data,
          params: err.config?.params
        }, 'Mercado Libre order search failed')
      } else {
        logger.error(err)
      }
      throw new Error('Error to search meli orders')
    }
  }

  async getOrderDetails (orderId: number): Promise<OrderDetails> {
    try {
      const headers = await this.getHeader()
      const response = await axios.get<OrderDetails>(
        this.getOrderDetailURL(orderId),
        {
          headers
        }
      )
      return response.data
    } catch (err) {
      logger.error(err)
      throw new Error('Error to get order detail with id ' + orderId)
    }
  }

  async getShippingDetails (orderId: number): Promise<ShippingResponse> {
    try {
      const headers = await this.getHeader()
      const response = await axios.get<ShippingResponse>(
        this.getShippingDetailURL(orderId),
        {
          headers
        }
      )
      return response.data
    } catch (err) {
      logger.error(err)
      throw new Error('Error to get order shipment detail with id ' + orderId)
    }
  }

  async getItemDetail (itemId: string): Promise<ItemDetailResponse> {
    try {
      const headers = await this.getHeader()
      const response = await axios.get<ItemDetailResponse>(
        this.getItemDetailURL(itemId),
        {
          headers
        }
      )
      return response.data
    } catch (err) {
      logger.error(err)
      throw new Error('Error to get order shipment detail with id ' + itemId)
    }
  }

  async getOrderByToday (): Promise<MeliNotionTable[]> {
    // eslint-disable-next-line
    return new Promise<MeliNotionTable[]>(async (resolve, reject) => {
      try {
        const resultDTO = new Array<MeliNotionTable>()

        const from = dayjs()
          .utcOffset(-0)
          .set('hours', CUTOFF_T)
          .startOf('hour')
          .subtract(3, 'day')
          .format()

        const filter = {
          item: null,
          tags: ShippingStatus.not_delivered,
          'order.status': OrderStatus.paid,
          'order.date_created.from': from,
          'order.date_created.to': null,
          sort: 'date_desc',
          limit: null
        }
        const orders = await this.getOrders(filter)

        console.log('orders', orders)

        for (const order of orders.results) {
          const orderDetails = await this.getOrderDetails(order.id)
          const rowTable: MeliNotionTable = {
            title:
              order.order_items.length > 1
                ? order.order_items[1].item.title
                : 'Compra de Carrito',
            orderId: order.id,
            date: dayjs().format(),
            status: order.status as typeof rowTable.status,
            clientName: `${orderDetails.buyer.first_name} ${orderDetails.buyer.last_name}`,
            clientUser: orderDetails.buyer.nickname,
            reciverName: '',
            tags: [''],
            logisticType: '',
            packItems: new Array<MeliNotionItem>()
          }
          // If the order has a shipping, we get the shipping details
          if (orderDetails.shipping.id !== null) {
            const shippingDetails = await this.getShippingDetails(order.id)
            if (
              shippingDetails.substatus === ShippingStatus.ready ||
              shippingDetails.substatus === ShippingStatus.print
            ) {
              logger.info('es candidata: ' + order.id)
              // TODO: add tag to notion: 'Enviar Hoy'
            }
            rowTable.logisticType =
              LOGISTIC_TYPE.find(
                (type) => type.value === shippingDetails.logistic_type
              )?.label ?? ''

            // for (const item of shippingDetails.shipping_items) {
            //   const itemDetails = await this.getItemDetail(item.id)

            //   const meliNotionItem = {
            //     title: item.description,
            //     img: itemDetails.pictures[0].secure_url,
            //     quantity: String(item.quantity),
            //     productId: item.id,
            //     sku:
            //       order.order_items.find((prod) => prod.item.id === item.id)
            //         ?.item.seller_sku ?? ''
            //   }
            //   rowTable.packItems.push(meliNotionItem)
            // }
          }

          for (const item of orderDetails.order_items) {
            const itemDetails = await this.getItemDetail(item.item.id)

            const meliNotionItem = {
              title: item.item.title,
              img: itemDetails.pictures[0].secure_url,
              quantity: String(item.quantity),
              productId: item.item.id,
              sku: item.item.seller_sku
            }
            rowTable.packItems.push(meliNotionItem)
          }
          resultDTO.push(rowTable)
        }

        resolve(resultDTO)
      } catch (err) {
        logger.error(err)
        reject(err)
        throw new Error('Error to get today orders')
      }
    })
  }
}
