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
  getUser: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Comment, include: [Restaurant] },

        ]
      })
      const data = user.toJSON()
      const commentedRes = data.Comments.map(c => c.Restaurant) || []
      const followers = data.Followers.map(f => ({
        id: f.id,
        name: f.name,
        image: f.image
      })) || []
      const followings = data.Followings.map(f => ({
        id: f.id,
        name: f.name,
        image: f.image
      })) || []

      user = {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        description: data.description,
        isAdmin: data.isAdmin,
        followers: followers ? followers : [],
        followersNum: followers.length ? followers.length : 0,
        followings: followings ? followings : [],
        followingsNum: followings.length ? followings.length : 0,
        commentedRes: commentedRes,
        commentedResNum: commentedRes.length ? commentedRes.length : 0,
        favoritedRes: data.FavoritedRestaurants ? data.FavoritedRestaurants : [],
        favoritedResNum: data.FavoritedRestaurants.length ? data.FavoritedRestaurants.length : 0
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