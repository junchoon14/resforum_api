const categoryService = require('../services/categoryService.js')

const categoryController = {
  getCategories: async (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_message', data['message'])
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_message', data['message'])
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_message', data['message'])
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController