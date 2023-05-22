import express from 'express'
import cors from 'cors'
// import dotenv from 'dotenv'
import logger from 'morgan'
import * as path from 'path'
import mongoose from 'mongoose'
// import vue from vue;

import 'dotenv/config'
try {
  mongoose.connect(process.env.APP_MONGO_URL).then(() => {
    console.log('Databases conected')
  })
} catch (error) {
  console.warn('Connection to mongo faile', error)
  throw error
}

// routes
import streamRouter from './modules/stream/stream.controller'
import contentRouter from './modules/content/content.controller'
import moviesRouter from './modules/movies/movies.controller'

const app = express()
app.use(cors())
app.use(express.json())
app.use(logger('dev'))

// endpoints
app.use('/stream', streamRouter)
app.use('/content', contentRouter)
app.use('/movies', moviesRouter)

// Configure
const PORT = process.env.APP_PORT || 8081

app.listen(PORT, () => {
  console.log('Lets go streaming')
  console.log(`http://localhost:${PORT}`)
})
