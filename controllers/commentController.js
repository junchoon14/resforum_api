const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      res.redirect(`restaurant/$(req.body.restaurantId)`)
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = commentController