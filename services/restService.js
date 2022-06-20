const { Restaurant, Category, Comment, User } = require('../models')
const pageLimit = 10

const restService = {
  getRestaurants: async (req, res, callback) => {
    try {
      let offset = 0
      let whereQuery = {}
      let categoryId = ''
      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }
      if (req.query.categoryId) {
        categoryId = Number(req.query.categoryId)
        whereQuery['CategoryId'] = categoryId
      }
      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: whereQuery,
        limit: pageLimit,
        offset: offset
      })
      const categories = await Category.findAll({ raw: true })
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))

      let page = Number(req.query.page) || 1
      let pages = Math.ceil(restaurants.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1) // 產生長度符合的陣列，做出頁數陣列，[1,2,3,...]
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      callback({ restaurants: data, categories, categoryId, page, pages, totalPage, prev, next })
    } catch (err) {
      console.warn(err)
    }
  },
  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      await restaurant.update({
        ...restaurant.dataValues,
        views: restaurant.dataValues.views ? restaurant.dataValues.views + 1 : 1
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      callback({ restaurant: restaurant.toJSON(), isFavorited })
    } catch (err) {
      console.warn(err)
    }

  },
  getFeeds: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      })
      const comments = await Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
      callback({ restaurants, comments })
    } catch (err) {
      console.warn(err)
    }
  },
  getTopRes: async (req, res, callback) => {
    try {
      let restaurants = await Restaurant.findAll({
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' }
        ]
      })
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        categoryName: r.dataValues.Category.name,
        description: r.dataValues.description.substring(0, 50),
        favoritedNum: r.dataValues.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(r => r.id).includes(r.dataValues.id)
      }))
      restaurants.sort((a, b) => Number(b.favoritedNum) - Number(a.favoritedNum))
      restaurants = restaurants.filter(r => r.favoritedNum > 0).slice(0, 10).filter(x => x !== undefined)
      callback({ restaurants })
    } catch (err) {
      console.warn(err)
    }
  },
  getDashboard: async (req, res, callback) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const data = restaurant.toJSON()
      restaurant = {
        id: data.id,
        name: data.name,
        category: data.Category.name,
        commentsNum: data.Comments.length ? data.Comments.length : 0,
        views: data.views ? data.views : 0,
        favoritedNum: data.FavoritedUsers.length ? data.FavoritedUsers.length : 0
      }
      callback({ restaurant })
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = restService