const restService = require('../../services/restService.js')

const restController = {
  getRestaurants: (req, res) => {
    restService.getFeeds(req, res, (data) => res.json(data))
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.json(data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => res.json(data))
  },
  getTopRes: (req, res) => {
    restService.getTopRes(req, res, (data) => res.json(data))
  },
  getDashboard: (req, res) => {
    restService.getDashboard(req, res, (data) => res.json(data))
  }
}

module.exports = restController