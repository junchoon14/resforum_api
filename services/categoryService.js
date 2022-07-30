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
        return callback({ categories, category })
      } 
      callback({ categories })
    } catch (err) {
      console.warn(err)
    }
  },
  postCategory: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: "Name didn't exit" })
      }
      await Category.create({
        name: req.body.name
      })
      callback({ status: 'success', message: 'Category was successfully created' })
    } catch (err) {
      console.warn(err)
    }
  },
  putCategory: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: "Name didn't exit" })
      }
      const category = await Category.findByPk(req.params.id)
      await category.update({
        name: req.body.name
      })
      callback({ status: 'success', message: 'Category was successfully updated' })
    } catch (err) {
      console.warn(err)
    }
  },
  deleteCategory: async (req, res, callback) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      callback({ status: 'success', message: "Category was successfully deleted" })
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = categoryService