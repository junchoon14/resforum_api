const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant } = db


const strategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, username, password, cb) => {
    try {
      const checkUser = await User.findOne({ where: { email: username } })
      if (!checkUser) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      const isMatch = await bcrypt.compare(password, checkUser.password)
      if (!isMatch) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      } else {
        return cb(null, checkUser)
      }
    } catch (err) {
      return cb(err)
    }
  }
)

passport.use(strategy)

//---------- Async end------------

// serialize and deserialize user
//取得user資料，將id轉換到session
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
//從client端的session中取得id來提取user資料
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }
    ]
  }).then(user => {
    return cb(null, user.toJSON())
  })
})

module.exports = passport