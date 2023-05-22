import axios from 'axios'
import * as cheerio from 'cheerio'
import { stringify, parse } from 'qs'
import {
  BASE_SERCH_URL,
  BASE_URL,
  MAGNET_KEY,
  MAGENT_SPLIT,
  IMDB_API_URL,
  IMDB_KEY,
} from './movies.const'
import moviesModel from './movies.model'
import { Movie } from './movies.interface'

export const movieSearch = async (searchQuery: string) => {
  const searchResult = await axios.get(`${BASE_SERCH_URL}/${searchQuery}`)
  if (!searchResult.data) {
    throw new Error('Search results are empty')
  }
  const $ = cheerio.load(searchResult.data)
  const dataTable = $('#index tr').toArray()
  return dataTable
    .reduce((acc, item) => {
      const [_, _magnet, _title] = $(item).find('a').toArray()
      const magnetLink = $(_magnet).attr('href')
      const title = $(_title).text()
      const torrent = `${BASE_URL}${$(_title).attr('href')}`
      const parseMagnetLink = parse(magnetLink)
      if (typeof parseMagnetLink[MAGNET_KEY] === 'string') {
        const magnet = String(
          parseMagnetLink[MAGNET_KEY].replace(MAGENT_SPLIT, '')
        )
        acc.push({
          title,
          magnet,
          torrent,
        })
      }
      return acc
    }, [])
    .filter(item => item.torrent)
}

export const create = async (input: Movie) => {
  const item = new moviesModel(input)
  await item.save()
  return item
}

export const update = (input: Partial<Movie>, id: string) => {
  return moviesModel.findByIdAndUpdate(id, input, {
    new: true,
  })
}

export const deleteOne = (id: string) => {
  return moviesModel.findByIdAndRemove(id)
}
export const findOne = (id: string) => {
  return moviesModel.findById(id)
}
export const findAll = () => {
  return moviesModel.find()
}
