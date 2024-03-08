import { ObjectId } from 'mongodb'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
export default class MeliToken {
  @ObjectIdColumn()
    _id: ObjectId

  @Column()
    accessToken: string

  @Column()
    tokenType: string

  @Column()
    expiresIn: number

  @Column()
    scope: string

  @Column()
    userId: number

  @Column()
    refreshToken: string

  constructor (
    id?: ObjectId,
    accessToken?: string,
    tokenType?: string,
    expiresIn?: number,
    scope?: string,
    userId?: number,
    refreshToken?: string
  ) {
    this._id = id ?? new ObjectId()
    this.accessToken = accessToken ?? ''
    this.tokenType = tokenType ?? ''
    this.expiresIn = expiresIn ?? 0
    this.scope = scope ?? ''
    this.userId = userId ?? 0
    this.refreshToken = refreshToken ?? ''
  }
}
