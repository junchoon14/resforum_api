const express = require('express')
const { create } = require('express-handlebars') //ver 6.0
const hbs = create({
  // partialsDir: 'views/partials',
  defaultLayout: 'main',
  // helpers: require('./config/hbs-helpers'),
  extname: '.hbs'
})
const db = require('./models')
const app = express()
const port = 3000

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

require('./routes')(app)