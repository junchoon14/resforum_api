const userService = require('../userService')
const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Followship } = require('../models')
const fs = require('fs')
const { ImgurClient } = require('imgur')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    try {
      if (req.body.passwordCheck !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('/signup')
      }
      const checkUser = User.findOne({ where: { email: req.body.email } })
      if (!checkUser) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      }
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      console.warn(err)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //from userService.js
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      res.render('profile', data)
    })
  },
  editUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      res.render('editProfile', data)
    })
  },
  putUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect(`/users/${data.userId}`)
    })
  },
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.render('topUser', data)
    })
  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  }
}

module.exports = userController