import {
  type EntityTarget,
  type ObjectLiteral,
  type Repository
} from 'typeorm'
import binomiodb from '../db'

export default abstract class GenericRepository {
  protected repository: Repository<ObjectLiteral>

  constructor (entity: EntityTarget<ObjectLiteral>) {
    this.repository = binomiodb.getRepository(entity)
  }
}
