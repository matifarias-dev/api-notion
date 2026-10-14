import cors from 'cors'
import express from 'express'
import http from 'http'
import 'reflect-metadata'
import binomiodb from './db'

import Router from './routes/routes'
import {
  AMBIENTE,
  CORS_ORIGIN,
  PORT
} from './utils/env'
import { logger } from './utils/logger'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors(
    CORS_ORIGIN === ''
      ? { origin: false }
      : { origin: CORS_ORIGIN.split(',').map((origin) => origin.trim()) }
  )
)
app.use(Router)

export const startServer = async (): Promise<void> => {
  try {
    const datasource = await binomiodb.initialize()
    logger.info(
      `Connected to db name: ${String(datasource.options.database)} (${AMBIENTE})`
    )

    const server = http.createServer(app)
    server.listen(PORT, () => {
      logger.info(`Connected at port: ${PORT}`)
    })
  } catch (err) {
    logger.error({ err }, 'Unable to start api-notion')
    process.exitCode = 1
  }
}

if (require.main === module) {
  void startServer()
}

export default app
