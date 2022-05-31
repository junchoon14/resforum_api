const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      console.warn(err)
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      return res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (err) {
      console.warn(err)
    }
  },
}

module.exports = commentController