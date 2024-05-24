import { Router } from 'express'
import NotionService from '../services/notionService'

const notionRouter = Router()
const notionService = new NotionService()

notionRouter.get('/getDBMeli', (_, res) => {
  notionService
    .getDataBaseMeli()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
})

export default notionRouter
