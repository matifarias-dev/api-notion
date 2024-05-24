import { Router } from 'express'
import { type MeliOrderFilter } from '../interfaces/meli.interface'
import MeliService from '../services/MeliService'
import { logger } from '../utils/logger'

const meliRouter = Router()
const meliService = new MeliService()

meliRouter.get('/login', (_, res) => {
  res.redirect(meliService.getAuthURL())
})

// https://localhost:3000/meli/auth-success
meliRouter.get('/auth-success', (req, res) => {
  const code = String(req.query.code)
  logger.info('code status: ' + code)
  meliService
    .changeCodeForToken(code)
    .then((data) => {
      res.status(200).send('Authorization successful ' + data.accessToken)
      logger.info('Authorization successful: ' + JSON.stringify(data))
    })
    .catch((err) => res.status(500).send(err))
})

meliRouter.get('/auth-token', (_, res) => {
  meliService
    .getToken()
    .then((token) => {
      res.status(200).send(token)
    })
    .catch((err) => res.status(500).send(err))
})

meliRouter.get('/auth-time-left', (_, res) => {
  meliService
    .getAuthTimeLeft()
    .then((timeLeft) => {
      res.status(200).send(`Token time left: ${timeLeft}`)
    })
    .catch((err) => res.status(500).send(err))
})

// https://localhost:3000/meli/notifications
meliRouter.post('/notifications', (req, res) => {
  res.status(200).send('OK')
  logger.info('Notification received: ' + JSON.stringify(req.body))
})

meliRouter.post('/orders', (req, res) => {
  const body = req.body
  if (body === null) res.status(400).send('missing arguments')
  meliService
    .getOrders(body as MeliOrderFilter)
    .then((orders) => {
      return res.status(200).send(orders)
    })
    .catch((err) => {
      logger.error(err)
      res.status(500).send(err)
    })
})

meliRouter.get('/orders/:id', (req, res) => {
  if (req.params.id === null) res.status(400).send('missing argument id')
  meliService
    .getOrderDetails(Number(req.params.id))
    .then((order) => {
      return res.status(200).send(order)
    })
    .catch((err) => {
      logger.error(err)
      res.status(500).send(err)
    })
})

meliRouter.get('/orders/:id/shipments', (req, res) => {
  if (req.params.id === null) res.status(400).send('missing argument id')
  meliService
    .getOrderDetails(Number(req.params.id))
    .then((order) => {
      return res.status(200).send(order)
    })
    .catch((err) => {
      logger.error(err)
      res.status(500).send(err)
    })
})

meliRouter.get('/item/:id', (req, res) => {
  if (req.params.id === null) res.status(400).send('missing argument id')
  meliService
    .getItemDetail(req.params.id)
    .then((order) => {
      return res.status(200).send(order)
    })
    .catch((err) => {
      logger.error(err)
      res.status(500).send(err)
    })
})

meliRouter.get('/todayOrders', (_, res) => {
  meliService
    .getOrderByToday()
    .then((orders) => {
      res.status(200).send(orders)
    })
    .catch((err) => {
      logger.error(err)
      res.status(500).send(err)
    })
})

export default meliRouter
