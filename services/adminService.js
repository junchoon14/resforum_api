const { Restaurant, Category } = require('../models')
const fs = require('fs')
const { ImgurClient } = require('imgur')

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const IMGUR_CLIENT_SECRET = process.env.IMGUR_CLIENT_SECRET
const IMGUR_REFRESH_TOKEN = process.env.IMGUR_REFRESH_TOKEN
const IMGUR_ALBUM_ID = process.env.IMGUR_ALBUM_ID

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
  createRestaurant: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      callback({ categories })
    } catch (err) {
      console.warn(err)
    }
  },
  postRestaurant: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: "Name didn't exist" })
      }

      const { file } = req
      if (file) {
        const client = new ImgurClient({
          clientId: IMGUR_CLIENT_ID,
          clientSecret: IMGUR_CLIENT_SECRET,
          refreshToken: IMGUR_REFRESH_TOKEN,
        })
        const imgurRes = await client.upload({
          image: fs.createReadStream(file.path),
          type: 'stream',
          album: IMGUR_ALBUM_ID
        })
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: imgurRes ? imgurRes.data.link : null,
          CategoryId: req.body.categoryId
        })
      } else {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        })
      }
      callback({ status: 'success', message: 'Restaurant was successfully created' })
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
  deleteRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      callback({ status: 'success', message: 'Restaurant was successfully deleted!' })
    } catch (err) {
      console.warn(err)
    }
  },

}

module.exports = adminService