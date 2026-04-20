console.log('testi')
const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
console.log('PORT:', config.PORT)
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
}).on('error', (err) => {
  console.log('Listen virhe:', err.message)
})