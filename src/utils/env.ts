import dotenv from 'dotenv'
dotenv.config()

const parsePort = (name: string, value: string | undefined, fallback: number): number => {
  const port = Number(value ?? fallback)

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a valid TCP port`)
  }

  return port
}

export const PORT = parsePort('PORT', process.env.PORT, 3000)
export const AMBIENTE = process.env.AMBIENTE ?? 'local'
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? ''

export const NOTION_SECRET = process.env.NOTION_SECRET ?? ''
export const NOTION_MELI_DB = process.env.NOTION_MELI_DB ?? ''

export const APP_ID_MELI = process.env.APP_ID_MELI
export const CLIENT_SECRET_MELI = process.env.CLIENT_SECRET_MELI
export const REDIRECT_MELI_URL = process.env.REDIRECT_MELI_URL
export const MELI_USER_ID = Number(process.env.MELI_USER_ID ?? 0)

export const DB_PORT = parsePort('DB_PORT', process.env.DB_PORT, 27017)
export const DB_HOST = process.env.DB_HOST ?? 'localhost'
export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_AUTH_SOURCE = process.env.DB_AUTH_SOURCE
