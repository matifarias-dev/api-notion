import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { readFileSync } from 'fs-extra'
import http from 'http'
import https from 'https'
import binomiodb from './db'
import meliRouter from './routes/meliTokenRoutes'
import notionRouter from './routes/notionRoutes'
import checkVersion from './utils/checkVersion'
import { AMBIENTE, HTTPS_CRT, HTTPS_KEY, PORT } from './utils/env'
import { logger, loggerHttp } from './utils/logger'

dotenv.config()
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(loggerHttp)
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

app.get('/healthCheck', (_, res) =>
  res.status(200).send({ status: 'OK', version: checkVersion() })
)

app.use('/notion', notionRouter)
app.use('/meli', meliRouter)

export default app
