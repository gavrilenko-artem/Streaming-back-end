import axios from 'axios'
import { stringify } from 'qs'
import { IMDB_API_URL, IMDB_KEY } from './movies.const'

export const serchInIMDB = async query => {
  const queryParams = stringify({
    language: 'ru',
    api_key: IMDB_KEY,
    query,
  })

  const {
    data: { results },
  } = await axios.get(`${IMDB_API_URL}/search/movie?${queryParams}`)
  const [movie] = results
  return movie
}

export const getMovieFromIMDB = async (IMDBId: string) => {
  const queryParams = stringify({
    language: 'ru',
    api_key: IMDB_KEY,
  })

  const result = await axios.get(
    `${IMDB_API_URL}/movie/${IMDBId}?${queryParams}`
  )
  return result.data
}
