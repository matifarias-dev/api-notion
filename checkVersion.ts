import { readFileSync } from 'fs-extra'
import { logger } from './logger'

const checkVersion = (): string => {
  try {
    const data = readFileSync('package.json', 'utf8')
    return JSON.parse(data).version
  } catch (err) {
    logger.error(err)
    return ''
  }
}

export default checkVersion
