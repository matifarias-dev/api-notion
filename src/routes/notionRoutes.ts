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

notionRouter.get('/getDBMeliProperties', (_, res) => {
  notionService
    .getDataBaseMeliProperties()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
})

notionRouter.get('/writeDataOnMeliDB', (_, res) => {
  notionService
    .writeDataOnMeliDB()
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
})

export default notionRouter
