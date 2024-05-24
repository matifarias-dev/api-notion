import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { readFileSync } from 'fs-extra'
import http from 'http'
import https from 'https'
import 'reflect-metadata'
import binomiodb from './db'

import Router from './routes/routes'
import {
  AMBIENTE,
  CONTEXT_ROOT,
  HTTPS_CRT,
  HTTPS_KEY,
  PORT
} from './utils/env'
import { logger } from './utils/logger'
// import { logger, loggerHttp } from './utils/logger'
dotenv.config()
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(loggerHttp)
app.use(cors())

binomiodb
  .initialize()
  .then((datasource) => {
    logger.info('Connected to db name: ' + String(datasource.options.database))
  })
  .catch((err) => {
    console.log(err)
  })

let server = http.createServer(app)
if (AMBIENTE === 'local') {
  logger.info('Ambiente local')
  server = https.createServer(
    {
      key: readFileSync(HTTPS_KEY),
      cert: readFileSync(HTTPS_CRT)
    },
    app
  )
}

server.listen(PORT, () => {
  logger.info(`connected at port: ${PORT}`)
})

app.use(CONTEXT_ROOT, Router)

export default app
