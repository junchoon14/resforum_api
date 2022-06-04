const bcrypt = require('bcryptjs')
const { User, Favorite, Followship } = require('../models')
const user = require('../models/user')

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

  addFavorite: async (req, res) => {
    try {
      await Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },

  removeFavorite: async (req, res) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      await favorite.destroy()
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },
  getTopUser: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })

      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.dataValues.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      console.log(users)
      return res.render('topUser', { users })
    } catch (err) {
      console.warn(err)
    }
  },
  addFollowing: async (req, res) => {
    try {
      await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const following = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      await following.destroy()
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },
}

module.exports = userController