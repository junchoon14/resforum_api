const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

app.engine('.hbs', handlebars({
  partialsDir: 'views/partials',
  layoutsDir: 'views/layouts',
  defaultLayout: 'main',
  helpers: require('./config/hbs-helpers'),
  extname: '.hbs'
}))

app.set('view engine', '.hbs')

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})