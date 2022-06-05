const { Restaurant, Category, Comment, User } = require('../models')
const pageLimit = 10


const restController = {
  getRestaurants: async (req, res) => {
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
      // console.log(restaurants)
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
      let prev = page - 1 < 0 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      return res.render('restaurants', { restaurants: data, categories, categoryId, page, pages, totalPage, prev, next })
    } catch (err) {
      console.warn(err)
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited })
    } catch (err) {
      console.warn(err)
    }

  },
  getFeeds: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
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
      return res.render('feeds', { restaurants, comments })
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = restController