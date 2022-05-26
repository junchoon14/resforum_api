const { Restaurant } = require('../models')
// const multer = require('multer')
// const upload = multer({
//   limits: {
//     fileSize: 2 * 1024 * 1024,
//   },
//   fileFilter(req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
//       cb('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。');
//     }
//     cb(null, true);
//   },
// }).any()

const fs = require('fs')
const { ImgurClient } = require('imgur')
const IMGUR_CLIENT_ID = '8542a2f1aeb6209'
const IMGUR_CLIENT_SECRET = 'c1c5fecd344cbfdfd09009b7f5b96b72eef73073'
const IMGUR_REFRESH_TOKEN = 'e08a283d448bf2d3b69ca2629dafa4062478d979'
const IMGUR_ALBUM_ID = 'YIMQzpA'

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
      // const categories = await Category.findAll({
      //   raw: true,
      //   nest: true
      // })
      return res.render('admin/create', {
        //  categories 
      })
    } catch (err) {
      console.warn(err)
    }
  },
  postRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }

      const { file } = req // equal to const file = req.file
      if (file) {
        // fs.readFile(file.path, (err, data) => {
        //   if (err) console.log('Error: ', err)
        //   fs.writeFile(`upload/${file.originalname}`, data, () => {
        //     return Restaurant.create({
        //       name: req.body.name,
        //       tel: req.body.tel,
        //       address: req.body.address,
        //       opening_hours: req.body.opening_hours,
        //       description: req.body.description,
        //       image: file ? `/upload/${file.originalname}` : null
        //     }).then((restaurant) => {
        //       req.flash('success_messages', 'restaurant was successfully created')
        //       return res.redirect('/admin/restaurants')
        //     })
        //   })
        // })
        const client = new ImgurClient({
          clientId: IMGUR_CLIENT_ID,
          clientSecret: IMGUR_CLIENT_SECRET,
          refreshToken: IMGUR_REFRESH_TOKEN,
        })
        const response = await client.upload({
          image: createReadStream(file.path),
          type: 'stream',
          album: IMGUR_ALBUM_ID
        })
        console.log(response.data)
        // } else {
        //   return Restaurant.create({
        //     name: req.body.name,
        //     tel: req.body.tel,
        //     address: req.body.address,
        //     opening_hours: req.body.opening_hours,
        //     description: req.body.description,
        //     image: null
        //   }).then((restaurant) => {
        //     req.flash('success_messages', 'restaurant was successfully created')
        //     return res.redirect('/admin/restaurants')
        //   })
      }
    } catch (err) {
      console.warn(err)
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        // include: [Category] 
      })
      return res.render('admin/restaurant', { restaurant })
    } catch (err) {
      console.warn(err)
    }
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },
  putRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      const { file } = req
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (restaurant && file) {
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
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: imgurRes ? imgurRes.data.link : restaurant.image
        })
      } else {
        req.flash('error_messages', "Restaurant didn't exist")
        return res.redirect('back')
      }
      if (restaurant) {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image
        })
      } else {
        req.flash('error_messages', "Restaurant didn't exist")
        return res.redirect('back')
      }
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      console.warn(err)
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.warn(err)
    }
  },
}

module.exports = adminController