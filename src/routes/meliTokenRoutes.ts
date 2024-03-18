import { Router } from 'express'
import MeliTokenService from '../services/MeliTokenService'
import { logger } from '../utils/logger'

const meliRouter = Router()
const meliTokenService = new MeliTokenService()

meliRouter.get('/login', (_, res) => {
  res.redirect(meliTokenService.getAuthURL())
})

// https://localhost:3000/meli/auth-success
meliRouter.get('/auth-success', (req, res) => {
  const code = String(req.query.code)
  logger.info('code status: ' + code)
  meliTokenService
    .changeCodeForToken(code)
    .then((data) => {
      res.status(200).send('Authorization successful ' + data.accessToken)
      logger.info('Authorization successful: ' + JSON.stringify(data))
    })
    .catch((err) => res.status(500).send(err))
})

meliRouter.get('/auth-token', (_, res) => {
  meliTokenService
    .getToken()
    .then((token) => {
      res.status(200).send(token)
    })
    .catch((err) => res.status(500).send(err))
})

meliRouter.get('/auth-time-left', (_, res) => {
  meliTokenService
    .getAuthTimeLeft()
    .then((timeLeft) => {
      res.status(200).send(`Token time left: ${timeLeft}`)
    })
    .catch((err) => res.status(500).send(err))
})

// https://localhost:3000/meli/notifications
export default meliRouter
