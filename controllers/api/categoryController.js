const categoryService = require('../../services/categoryService.js')

const categoryController = {
  getCategories: async (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_message', 'name didn\'t exist')
        req.redirect('back')
      }
      await Category.create({
        name: req.body.name
      })
      return res.redirect('/admin/categories')
    } catch (err) {
      console.warn(err)
    }
  },
  putCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_message', 'name didn\'t exist')
        req.redirect('back')
      }
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      return res.redirect('/admin/categories')
    } catch (err) {
      console.warn(err)
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return res.redirect('/admin/categories')
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = categoryController