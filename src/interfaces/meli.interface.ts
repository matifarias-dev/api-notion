import { type grantTypes, type errorTypes } from '../types/meli.types'

export interface MeliToken {
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
