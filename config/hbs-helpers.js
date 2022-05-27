const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) return options.fn(this)
    return options.inverse(this)
  },

  ifDateLess: function (a, b, options) {
    if ((Date.parse(a)).valueOf() < (Date.parse(b)).valueOf()) return options.fn(this)
    return options.inverse(this)
  },

  dateFormatTw: function (a) {
    return moment(a).format('YYYY 年 MM 月 DD 日 A hh:mm')
  },

  fromNow: function (a) {
    return moment(a).fromNow()
  },

}