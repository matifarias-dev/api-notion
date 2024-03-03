import dayjs from 'dayjs'
import pino from 'pino'
import pinoHttp from 'pino-http'

const pinoOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: dayjs().format('HH:mm:ss'),
      ignore: 'pid,hostname'
    }
  }
}
const logger = pino(pinoOptions)

const loggerHttp = pinoHttp(pinoOptions)

export { logger, loggerHttp }
