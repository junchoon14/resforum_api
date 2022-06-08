const { Restaurant, Category } = require('../models')
const fs = require('fs')
const { ImgurClient } = require('imgur')

const adminService = {
  getRestaurants: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurants })
    } catch (err) {
      console.warn(err)
    }
  },
  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurant })
    } catch (err) {
      console.warn(err)
    }
  },

}

module.exports = adminService