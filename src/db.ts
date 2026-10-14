import 'reflect-metadata'
import { DataSource } from 'typeorm'
import MeliToken from './entities/MeliToken'
import {
  DB_AUTH_SOURCE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME
} from './utils/env'

const connectionTarget = [
  `mongodb://${DB_USERNAME != null && DB_USERNAME !== '' ? `${encodeURIComponent(DB_USERNAME)}:***@` : ''}`,
  `${DB_HOST}:${DB_PORT}/binomiodb`,
  DB_AUTH_SOURCE != null && DB_AUTH_SOURCE !== ''
    ? `?authSource=${encodeURIComponent(DB_AUTH_SOURCE)}`
    : ''
].join('')

console.info(`MongoDB connection target: ${connectionTarget}`)

const binomiodb = new DataSource({
  type: 'mongodb',
  host: DB_HOST,
  port: DB_PORT,
  database: 'binomiodb',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  authSource: DB_AUTH_SOURCE,
  entities: [MeliToken],
  logging: ['error']
})

export default binomiodb
