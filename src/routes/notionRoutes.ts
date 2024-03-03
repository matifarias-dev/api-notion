import { Router } from 'express'
import notionService from '../services/notionService'

const notionRouter = Router()
const service = notionService()

notionRouter.get('/prueba', (_, res) => {
  service
    .getDataBasePrueba()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
})

export default notionRouter
