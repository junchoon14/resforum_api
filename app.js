const express = require('express')
const { create } = require('express-handlebars') //ver 6.0
const hbs = create({
  // partialsDir: 'views/partials',
  defaultLayout: 'main',
  helpers: require('./config/hbs-helpers'),
  extname: '.hbs'
})
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')
// const db = require('./models')
const app = express()
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
  require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}
const passport = require('./config/passport')
app.use(cors())

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use('/upload', express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  // db.sequelize.sync()
  console.log(`App listening on port ${port}!`)
})

require('./routes')(app)