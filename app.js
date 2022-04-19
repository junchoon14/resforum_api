const express = require('express')
const { create } = require('express-handlebars') //ver 6.0
const hbs = create({
  // partialsDir: 'views/partials',
  defaultLayout: 'main',
  // helpers: require('./config/hbs-helpers'),
  extname: '.hbs'
})
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const { Passport } = require('./config/passport')
const app = express()
const port = 3000

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

require('./routes')(app, Passport)