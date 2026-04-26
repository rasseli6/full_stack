console.log('app.js ladattu')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('MONGODB_URI käytössä:', process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI)

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const config = require('./utils/config')
console.log('Yhdistetään:', config.MONGODB_URI)
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('connecting to MongoDB')

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

mongoose
  .connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    logger.info('connected to MongoDB')
    console.log('mongoose yhdistetty!')
  })
  .catch(error => {
    logger.error('error connection to MongoDB:', error.message)
    console.log('mongoose virhe:', error.message)
  })

console.log('mongoose.connect kutsuttu')
  
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(express.static(path.join(__dirname, '../client/dist')))
app.get(/.*/, (request, response) => {
  response.sendFile(path.join(__dirname, '../client/dist/index.html'))
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
