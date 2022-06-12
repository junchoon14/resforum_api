const commentService = require('../../services/commentService.js')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => res.json(data))
  },
  deleteComment: (req, res) => {
    commentService.deleteCommen(req, res, (data) => res.json(data))
  },
}

module.exports = commentController