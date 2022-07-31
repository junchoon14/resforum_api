const { User, Restaurant, Comment, Favorite, Followship } = require('../models')
const fs = require('fs')
const { ImgurClient } = require('imgur')

const userService = {
  getUser: async (req, res, callback) => {
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
      return callback({ user })
    } catch (err) {
      console.warn(err)
    }
  },
  editUser: async (req, res, callback) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      return callback({ user })
    } catch (err) {
      console.warn(err)
    }
  },
  putUser: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: "Name didn't exit" })
      }
      if (!req.body.email) {
        return callback({ status: 'error', message: "Email didn't exit" })
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
      return callback({ status: 'success', message: 'Profile was successfully to update' })
    } catch (err) {
      console.warn(err)
    }
  },
  getCurrentUser: (req, res, callback) => {
    if (req.user) {
      const currentUser = req.user
      return callback({ currentUser })
    } else {
      return callback({ status: 'error', message: "Current User didn't exit" })
    }
  },
  addFavorite: async (req, res, callback) => {
    try {
      await Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      return callback({ status: 'success', message: ' Add favorite successfully' })
    } catch (err) {
      console.warn(err)
    }
  },
  removeFavorite: async (req, res, callback) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      await favorite.destroy()
      return callback({ status: 'success', message: 'Remove favorite successfully' })
    } catch (err) {
      console.warn(err)
    }
  },
  getTopUser: async (req, res, callback) => {
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
      return callback({ users })
    } catch (err) {
      console.warn(err)
    }
  },
  addFollowing: async (req, res, callback) => {
    try {
      await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      return callback({ status: 'success', message: 'Add following successfully' })
    } catch (err) {
      console.warn(err)
    }
  },
  removeFollowing: async (req, res, callback) => {
    try {
      const following = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      await following.destroy()
      return callback({ status: 'success', message: 'Remove following successfully' })
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = userService