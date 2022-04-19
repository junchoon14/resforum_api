const { Restaurant } = require('../models')


const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        // include: [Category]
      })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      console.warn(err)
    }
  },
  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/create', { categories })
    } catch (err) {
      console.warn(err)
    }
  },
}

module.exports = adminController