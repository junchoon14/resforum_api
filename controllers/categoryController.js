const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res) => {
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
        return res.render('admin/categories', { categories, category })
      }
      return res.render('admin/categories', { categories })
    } catch (err) {
      console.warn(err)
    }
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