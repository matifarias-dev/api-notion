import axios, { type AxiosResponse } from 'axios'
import cron from 'node-cron'
import MeliToken from '../entities/MeliToken'
import { type MeliTokenResponse } from '../interfaces/meli.interface'
import { toMeliToken } from '../mappers/meli.mapper.'
import MeliTokenRepository from '../repositories/MeliTokenRepository'
import { GRANT_TYPE } from '../utils/constants'
import {
  APP_ID_MELI,
  CLIENT_SECRET_MELI,
  MELI_USER_ID,
  REDIRECT_MELI_URL
} from '../utils/env'
import { logger } from '../utils/logger'

export default class MeliTokenService {
  meliTokenRepository = new MeliTokenRepository()

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
      if (dataStored === null) {
        return await this.meliTokenRepository.saveMeliToken(
          toMeliToken(response.data)
        )
      } else {
        return await this.meliTokenRepository.saveMeliToken(
          toMeliToken(response.data, dataStored._id)
        )
      }
    } catch (err) {
      logger.error(err)
      throw new Error('error al guardar el token')
    }
  }

  async getToken (): Promise<MeliToken | null> {
    return await this.meliTokenRepository
      .getMeliToken({ userId: MELI_USER_ID })
      .then((token) => {
        if (token === null) return new MeliToken()
        return token
      })
      .catch((err) => {
        logger.error('error al obtener el token: ' + err)
        throw new Error('error al obtener el token')
      })
  }

  async refreshAuth (): Promise<MeliToken> {
    try {
      const lastToken = await this.getToken()
      if (lastToken === null) {
        throw new Error('No se encuentra un refresh token valido en db')
      }
      const response: AxiosResponse<MeliTokenResponse> = await axios.post(
        'https://api.mercadolibre.com/oauth/token',
        {
          grant_type: GRANT_TYPE.refresh,
          client_id: APP_ID_MELI,
          client_secret: CLIENT_SECRET_MELI,
          refresh_token: lastToken.refreshToken
        }
      )

      return await this.meliTokenRepository.saveMeliToken(
        toMeliToken(response.data)
      )
    } catch (err) {
      logger.error(err)
      throw new Error('error al obtener refresh token')
    }
  }

  startRefreshTask (miliseconds: number): void {
    const hs = miliseconds / 3600 - 1
    const min = 19800 / 360
    logger.info(
      `[TASK] Refresh token task will start in ${String(hs)} hs, ${min} minutos. `
    )
    setTimeout(
      () => {
        cron.schedule(`* ${min} /${String(hs)} * * *`, () => {
          logger.info('[TASK] Refresh token task has executed')
          this.refreshAuth()
            .then((token) => {
              logger.info(
                '[TASK] Authorization task successful: ' + token.refreshToken
              )
            })
            .catch((err) => {
              logger.error(err)
            })
        })
      },
      hs * 3600 + 19800
    )
  }
}
