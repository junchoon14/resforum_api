const userService = require('../../userService.js')

const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Followship } = require('../../models')
const fs = require('fs')
const { ImgurClient } = require('imgur')

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const userController = {
  signUp: async (req, res) => {
    try {
      if (req.body.passwordCheck !== req.body.password) {
        return res.json({ status: 'error', message: '兩次密碼輸入不同' })
      }
      const checkUser = await User.findOne({ where: { email: req.body.email } })
      if (!checkUser) {
        return res.json({ status: 'error', message: '信箱重複！' })
      }
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })
      return res.json({ status: 'success', message: '成功註冊帳號！' })
    } catch (err) {
      console.warn(err)
    }
  },
  signIn: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: "Required field didn't exit!" })
      }
      const username = req.body.email
      const password = req.body.password

      const user = await User.findOne({
        where: { email: username }
      })
      if (!user) return res.status(401).json({ status: 'error', message: "No such user found!" }) // 401權限不足
      if (!bcrypt.compare(password, user.password)) return res.status(401).json({ status: 'error', message: "Password didn't match!" })

      const payload = { id: user.id }
      const token = jwt.sign(payload, JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'OK',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    } catch (err) {
      console.warn(err)
    }
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },
  editUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      return res.json(data)
    })
  },
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      return res.json(data)
    })
  },
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      return res.json(data)
    })
  },
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      return res.json(data)
    })
  },
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      return res.json(data)
    })
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = userController