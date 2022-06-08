let routes = require('./routes')
let apis = require('./apis')

moudule.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)
}