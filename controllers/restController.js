const restService = require('../services/restService.js')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => res.render('restaurants', data))
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.render('restaurant', data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => res.render('feeds', data))
  },
  getTopRes: (req, res) => {
    restService.getTopRes(req, res, (data) => res.render('topRes', data))
  },
  getDashboard: (req, res) => {
    restService.getDashboard(req, res, (data) => res.render('dashboard', data))
  }
}

module.exports = restController