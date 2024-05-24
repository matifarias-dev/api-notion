import express from 'express'

import checkVersion from '../utils/checkVersion'
import meliRouter from './meliRoutes'
import notionRouter from './notionRoutes'

const Router = express.Router()
Router.get('/healthCheck', (_, res) =>
  res.status(200).send({ status: 'OK', version: checkVersion() })
)
Router.use('/notion', notionRouter)
Router.use('/meli', meliRouter)

export default Router
