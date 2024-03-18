import { type FindOptionsWhere } from 'typeorm'
import binomiodb from '../db'
import MeliToken from '../entities/MeliToken'

const meliRepository = binomiodb.getMongoRepository(MeliToken)

export default class MeliTokenRepository {
  async saveMeliToken (meliToken: MeliToken): Promise<MeliToken> {
    return await meliRepository.save(meliToken)
  }

  async getMeliToken (
    where: FindOptionsWhere<MeliToken> | Array<FindOptionsWhere<MeliToken>>
  ): Promise<MeliToken | null> {
    const meliToken = await meliRepository.findOneBy(where)
    console.log('MeliToken db: ' + JSON.stringify(meliToken))
    return meliToken
  }
}
