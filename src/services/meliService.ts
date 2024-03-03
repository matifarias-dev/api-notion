import axios, { type AxiosResponse } from 'axios'
import { readFileSync, writeFileSync } from 'fs-extra'
import { type MeliToken } from '../interfaces/meli.interface'
import {
  APP_ID_MELI,
  CLIENT_SECRET_MELI,
  REDIRECT_MELI_URL
} from '../utils/env'
import { logger } from '../utils/logger'

const createAuthURL = (): string =>
  `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID_MELI}&redirect_uri=${REDIRECT_MELI_URL}`

const saveAuthorization = (code: string): void => {
  logger.info('Saving authorization code: ' + code)
  writeFileSync('code.json', JSON.stringify({ authorization: code }))
}

const getToken = async (code: string): Promise<MeliToken> => {
  if (code === undefined || code === null) {
    logger.info('leyendo archivo code.json')
    code = JSON.parse(readFileSync('code.json', 'utf8'))
      .authorization as string
  }
  return await axios
    .post('https://api.mercadolibre.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: APP_ID_MELI,
      client_secret: CLIENT_SECRET_MELI,
      code,
      redirect_uri: REDIRECT_MELI_URL
    })
    .then((response: AxiosResponse<MeliToken>) => {
      writeFileSync('token.json', JSON.stringify(response.data))
      return response.data
    })
    .catch((err) => {
      logger.error(err)
      return err
    })
}

export default {
  createAuthURL,
  saveAuthorization,
  getToken
}
