import dotenv from 'dotenv'
dotenv.config()
export const PORT = process.env.PORT ?? 3000
export const AMBIENTE = process.env.AMBIENTE ?? 'local'
export const HTTPS_CRT = process.env.HTTPS_CRT ?? ''
export const HTTPS_KEY = process.env.HTTPS_KEY ?? ''
export const NOTION_TOKEN = process.env.NOTION_TOKEN
export const APP_ID_MELI = process.env.APP_ID_MELI
export const CLIENT_SECRET_MELI = process.env.CLIENT_SECRET_MELI
export const REDIRECT_MELI_URL = process.env.REDIRECT_MELI_URL
