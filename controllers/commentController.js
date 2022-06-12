const commentService = require('../services/commentService.js')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => res.redirect(`/restaurants/${data.RestaurantId}`))
  },
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => res.redirect(`/restaurants/${data.RestaurantId}`))
  }
}

module.exports = commentController