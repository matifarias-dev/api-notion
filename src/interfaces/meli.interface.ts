import { type errorTypes, type grantTypes } from '../types/meli.types'

export interface MeliTokenResponse {
  access_token: string
  token_type: grantTypes
  expires_in: number
  scope: string
  user_id: number
  refresh_token: string
}

export interface InvalidGrant {
  error_description: string
  error: errorTypes
  status: number
  cause: []
}
