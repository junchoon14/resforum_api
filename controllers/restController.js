const { Restaurant, Category } = require('../models')


const restController = {
  getRestaurants: async (req, res) => {
    try {
      let whereQuery = {}
      let categoryId = ''
      if (req.query.categoryId) {
        categoryId = Number(req.query.categoryId)
        whereQuery['CategoryId'] = categoryId
      }
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: whereQuery
      })
      const categories = await Category.findAll({ raw: true })

      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      // console.log(data)
      return res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (err) {
      console.warn(err)
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: Category
      })
      // console.log(restaurant)
      return res.render('restaurant', { restaurant })
    } catch (err) {
      console.warn(err)
    }

  }
}

module.exports = restController