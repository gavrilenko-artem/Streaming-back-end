import { Schema, model } from 'mongoose'
import { Movie } from './movies.interface'

const Movie = new Schema<Movie>({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    default: '',
  },
  poster: {
    type: String,
    default: '',
  },
  backdrop: {
    type: String,
    default: '',
  },
  trailer: {
    type: String,
    default: '',
  },
  runtime: {
    type: String,
    default: '',
  },
  ratingImdb: {
    type: String,
    default: '',
  },
  imdbId: {
    type: String,
    default: '',
  },
  rated: {
    type: String,
    default: '',
  },
  actors: [
    {
      type: String,
      default: '',
    },
  ],
  ganre: [
    {
      type: String,
      default: '',
    },
  ],
  director: [
    {
      type: String,
      default: '',
    },
  ],
  magnet: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  sourceUrl: {
    type: String,
    default: '',
  },
})

Movie.index({
  title: 'text',
  ganre: 'text',
})

export default model('Movie', Movie)
