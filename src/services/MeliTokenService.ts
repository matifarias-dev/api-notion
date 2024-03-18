import axios, { type AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import type MeliToken from '../entities/MeliToken'
import { type MeliTokenResponse } from '../interfaces/meli.interface'
import { toMeliToken } from '../mappers/meli.mapper.'
import MeliTokenRepository from '../repositories/MeliTokenRepository'
import { GRANT_TYPE, TIME_THRESHOLD } from '../utils/constants'
import {
  APP_ID_MELI,
  CLIENT_SECRET_MELI,
  MELI_USER_ID,
  REDIRECT_MELI_URL
} from '../utils/env'
import { logger } from '../utils/logger'

const meliTokenRepository = new MeliTokenRepository()

export default class MeliTokenService {
  getAuthURL = (): string =>
    `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID_MELI}&redirect_uri=${REDIRECT_MELI_URL}`

  async changeCodeForToken (code?: string): Promise<MeliToken> {
    try {
      const response: AxiosResponse<MeliTokenResponse> = await axios.post(
        'https://api.mercadolibre.com/oauth/token',
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
        logger.info('Updating token id: ' + String(dataStored._id))
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
          logger.info('Token expired with id: ' + String(token._id))
          return await this.refreshAuth(token)
        }
        logger.info('ID token found: ' + String(token?._id))
        return token
      })
      .catch((err) => {
        logger.error('Error to get a token: ' + err)
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
}
