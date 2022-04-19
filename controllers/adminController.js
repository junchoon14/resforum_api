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
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    })
      .then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
  },
}

module.exports = adminController