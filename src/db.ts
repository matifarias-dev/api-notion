import 'reflect-metadata'
import { DataSource } from 'typeorm'
import MeliToken from './entities/MeliToken'
import { DB_HOST, DB_PORT } from './utils/env'

const binomiodb = new DataSource({
  type: 'mongodb',
  host: DB_HOST,
  port: DB_PORT,
  database: 'binomiodb',
  entities: [MeliToken],
  logging: ['error']
})

export default binomiodb
