import { type ObjectId } from 'typeorm'
import MeliToken from '../entities/MeliToken'
import { type MeliTokenResponse } from '../interfaces/meli.interface'

export const toMeliToken = (
  meliTokenInterface: MeliTokenResponse,
  id?: ObjectId
): MeliToken => {
  const meliToken = new MeliToken(id)
  meliToken.accessToken = meliTokenInterface.access_token
  meliToken.tokenType = meliTokenInterface.token_type
  meliToken.expiresIn = meliTokenInterface.expires_in
  meliToken.scope = meliTokenInterface.scope
  meliToken.userId = meliTokenInterface.user_id
  meliToken.refreshToken = meliTokenInterface.refresh_token
  return meliToken
}
