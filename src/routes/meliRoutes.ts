import { Router } from 'express'
import meliService from '../services/meliService'
import { logger } from '../utils/logger'

const meliRouter = Router()

meliRouter.get('/login', (_, res) => {
  res.redirect(meliService.createAuthURL())
})

// https://localhost:3000/meli/auth-success
meliRouter.get('/auth-success', (req, res) => {
  const code = String(req.query.code)
  logger.info('code status: ' + code)
  meliService.saveAuthorization(code)
  meliService
    .getToken(code)
    .then((data) =>
      res.status(200).send('Authorization successful ' + data.expires_in)
    )
    .catch((err) => res.status(500).send(err))
})
// https://localhost:3000/meli/notifications

export default meliRouter
