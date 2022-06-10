const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant } = db

passport.use(
  new LocalStrategy(
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
        console.warn(err)
      }
    }
  ))

//---------- Async end------------

// serialize and deserialize user
//取得user資料，將id轉換到session
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
//從client端的session中取得id來提取user資料
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    console.log(err)
  }
})

//jwt
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const JWT_SECRET = process.env.JWT_SECRET

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = JWT_SECRET

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, cb) => {
    try {
      const user = await User.findByPk(jwt_payload.id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!user) return cb(null, false)
      return cb(null, user)
    } catch (err) {
      console.warn(err)
    }
  }))


module.exports = passport