import { Client } from '@notionhq/client'
import type {
  GetDatabaseResponse,
  QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints'
import { NOTION_MELI_DB, NOTION_SECRET } from '../utils/env'
import MeliService from './MeliService'

export default class NotionService {
  meliService = new MeliService()

  private readonly notion: Client = new Client({
    auth: NOTION_SECRET
  })

  async getDataBaseMeli (): Promise<QueryDatabaseResponse> {
    const response = await this.notion.databases.query({
      database_id: NOTION_MELI_DB
    })
    return response
  }

  async getDataBaseMeliProperties (): Promise<
  GetDatabaseResponse['properties']
  > {
    // Get the database properties out of our database
    const { properties } = await this.notion.databases.retrieve({
      database_id: NOTION_MELI_DB
    })
    return properties
  }

  async writeDataOnMeliDB (): Promise<void> {
    console.log('\n\n********* Writing Data *********\n\n')

    const todayOrders = await this.meliService.getOrderByToday()

    console.log('escribiendo en mercado libre testing')
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    todayOrders.forEach(async (order): Promise<any> => {
      const response = await this.notion.pages.create({
        cover: {
          type: 'external',
          external: {
            url:
              order.packItems.length > 1
                ? 'https://www.emb.cl/negociosglobales/pixnoti/2022/big20221205w9.jpg'
                : order.packItems[0].img
          }
        },
        icon: {
          type: 'emoji',
          emoji: order.packItems.length > 1 ? '🛒' : '📦'
        },
        parent: {
          database_id: NOTION_MELI_DB
        },
        properties: {
          Cliente: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: order.clientName
                }
              }
            ]
          },
          Usuario: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: order.clientUser
                }
              }
            ]
          },
          Accion: { select: { name: 'Pegar etiqueta' } },
          'Tipo de envio': { select: { name: '2 Mercado Envio' } },
          Maquina: { multi_select: [{ name: 'Laser' }] }
        }
      })
      console.log(response)
      return response
    })
  }
}
