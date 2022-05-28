const { Restaurant, Category } = require('../models')


const restController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      // console.log(restaurants)
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      // console.log(data)
      return res.render('restaurants', { restaurants })
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
      console.log(restaurant)
      return res.render('restaurant', { restaurant })
    } catch (err) {
      console.warn(err)
    }

  }
}

module.exports = restController