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
  getUser: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [{ model: Comment, include: [Restaurant] }]
      })
      const data = user.toJSON()
      const commentedRes = data.Comments.map(c => c.Restaurant)
      user = {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        description: data.description,
        isAdmin: data.isAdmin,
        commentedRes: commentedRes,
        commentedResNum: commentedRes.length
      }
      return res.render('profile', { user })
    } catch (err) {
      console.warn(err)
    }
  },
  editUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      return res.render('editProfile', { user })
    } catch (err) {
      console.warn(err)
    }
  },
  putUser: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      const { file } = req
      const user = await User.findByPk(req.params.id)
      if (file) {
        const client = new ImgurClient({
          clientId: process.env.IMGUR_CLIENT_ID,
          clientSecret: process.env.IMGUR_CLIENT_SECRET,
          refreshToken: process.env.IMGUR_REFRESH_TOKEN,
        })
        const imgurUser = await client.upload({
          image: fs.createReadStream(file.path),
          type: 'stream',
          album: process.env.IMGUR_ALBUM_ID
        })
        await user.update({
          ...user,
          name: req.body.name,
          email: req.body.email,
          description: req.body.description,
          image: imgurUser ? imgurUser.data.link : user.image
        })
      } else {
        await user.update({
          ...user,
          name: req.body.name,
          email: req.body.email,
          description: req.body.description,
          image: user.image
        })
      }
      req.flash('success_messages', 'Profile was successfully to update')
      res.redirect(`/users/${user.id}`)
    } catch (err) {
      console.warn(err)
    }
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