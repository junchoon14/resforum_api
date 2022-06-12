const { Comment } = require('../models')

const commentController = {
  postComment: async (req, res, callback) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      callback({ RestaurantId: req.body.restaurantId })
    } catch (err) {
      console.warn(err)
    }
  },
  deleteComment: async (req, res, callback) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      callback({ RestaurantId: comment.RestaurantId })
    } catch (err) {
      console.warn(err)
    }
  },
}

module.exports = commentController