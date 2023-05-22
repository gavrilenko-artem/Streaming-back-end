import { Router } from 'express'
import { CreateMovieRequest, SearchRequest } from './movies.interface'
import * as moviesServices from './movies.service'
import * as IMDBServices from './imdb.services'

const router = Router()

router.get(
  '/search',
  async ({ query: { searchQuery } }: SearchRequest, res) => {
    try {
      const result = await moviesServices.movieSearch(searchQuery)
      res.status(200).send(result)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

router.get(
  '/imdb-search',
  async ({ query: { searchQuery } }: SearchRequest, res) => {
    try {
      const result = await IMDBServices.serchInIMDB(searchQuery)
      res.status(200).send(result)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

router.get(
  '/imdb/:IMDBId',
  async ({ params: { IMDBId } }: SearchRequest, res) => {
    try {
      const result = await IMDBServices.getMovieFromIMDB(IMDBId)
      res.status(200).send(result)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

router.post('/', async ({ body }: CreateMovieRequest, res) => {
  try {
    const result = await moviesServices.create(body)
    res.status(200).send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/', async (_, res) => {
  try {
    const result = await moviesServices.findAll()
    res.status(200).send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})

export default router
