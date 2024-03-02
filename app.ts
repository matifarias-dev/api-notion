import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import checkVersion from './checkVersion'
import { logger, loggerHttp } from './logger'

dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(loggerHttp)
app.use(cors())

app.listen(PORT, () => {
  logger.info(`connected at port: ${PORT}`)
})

app.get('/health-check', (_, res) =>
  res.status(200).send({ status: 'OK', version: checkVersion() })
)
