import dayjs, { Dayjs } from 'dayjs'
import { ObjectId } from 'mongodb'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { toDate } from '../utils/DayjsTransform'

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

  @Column('date')
    expireInDateTime: Date

  @Column()
    scope: string

  @Column()
    userId: number

  @Column()
    refreshToken: string

  @Column('date')
    createdAt: Date

  constructor (
    id?: ObjectId,
    accessToken?: string,
    tokenType?: string,
    expiresIn = 21600,
    expireInDateTime?: Dayjs,
    scope?: string,
    userId?: number,
    refreshToken?: string,
    createdAt?: Dayjs
  ) {
    const now = dayjs()
    this._id = id ?? new ObjectId()
    this.accessToken = accessToken ?? ''
    this.tokenType = tokenType ?? ''
    this.expiresIn = expiresIn ?? 0
    this.expireInDateTime = toDate(expireInDateTime ?? now.add(expiresIn, 's'))
    this.scope = scope ?? ''
    this.userId = userId ?? 0
    this.refreshToken = refreshToken ?? ''
    this.createdAt = toDate(createdAt ?? now)
  }

  public getExpireInDateTime (): Dayjs {
    return dayjs(this.expireInDateTime)
  }

  public setExpireInDateTime (date: Dayjs): void {
    this.expireInDateTime = toDate(date)
  }

  public getCreatedAt (): Dayjs {
    return dayjs(this.createdAt)
  }

  public setCreateAt (date: Dayjs): void {
    this.createdAt = toDate(date)
  }
}
