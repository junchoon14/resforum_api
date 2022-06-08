const { Category } = require('../models')

const categoryService = {
  getCategories: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      if (req.params.id) {
        const category = await Category.findByPk(req.params.id, {
          raw: true,
          nest: true
        })
        callback({ categories, category })
      }
      callback({ categories })
    } catch (err) {
      console.warn(err)
    }
  },
}

module.exports = categoryService