import { ObjectId } from 'typeorm'
import MeliToken from '../entities/MeliToken'
import { type MeliTokenResponse } from '../interfaces/meli.interface'

export const toMeliToken = (
  meliTokenInterface: MeliTokenResponse,
  id?: ObjectId
): MeliToken => {
  const meliToken = new MeliToken(id)
  meliToken._id = id ?? new ObjectId()
  meliToken.accessToken = meliTokenInterface.access_token
  meliToken.tokenType = meliTokenInterface.token_type
  meliToken.scope = meliTokenInterface.scope
  meliToken.userId = meliTokenInterface.user_id
  meliToken.refreshToken = meliTokenInterface.refresh_token
  return meliToken
}
