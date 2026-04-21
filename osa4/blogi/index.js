console.log('testi')
const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
console.log('PORT:', config.PORT)
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})