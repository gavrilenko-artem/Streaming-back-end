import { Request } from 'express'

export interface SearchRequest extends Request {
  query: {
    searchQuery: string
  }
}

export interface GetMovieFromIMDBRequest extends Request {
  params: {
    IMDBId: string
  }
}

export interface CreateMovieRequest extends Request {
  body: Movie
}

export interface UpdateMovieRequest extends Request {
  body: Partial<Movie>
}

export interface DeleteMovieRequest extends Request {
  params: {
    id: string
  }
}

export interface GetMovieRequest extends Request {
  params: {
    id: string
  }
}

export interface Movie {
  title: string
  description: string
  year: string
  _id?: string
  poster: string
  trailer: string
  runtime: string
  ratingImdb: string
  imdbId: string
  rated: string
  actors: string[]
  ganre: sting[]
  magnet: string
  fileName: string
  sourceUrl: string
  director: string
}
