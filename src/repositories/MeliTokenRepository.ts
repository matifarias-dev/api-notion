import { type FindOptionsWhere } from 'typeorm'
import MeliToken from '../entities/MeliToken'
import GenericRepository from './GenericRepository'

export default class MeliTokenRepository extends GenericRepository {
  constructor () {
    super(MeliToken)
  }

  async saveMeliToken (meliToken: MeliToken): Promise<MeliToken> {
    return await this.repository.save(meliToken)
  }

  async getMeliToken (
    where: FindOptionsWhere<MeliToken> | Array<FindOptionsWhere<MeliToken>>
  ): Promise<MeliToken | null> {
    const data = await this.repository.findOneBy(where)
    return data as MeliToken
  }
}
