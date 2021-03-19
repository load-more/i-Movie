// 连接数据库的共用模块
let mg = require('mongoose')

mg.connect('mongodb://localhost/movieServer', {
  auth: {
    authSource: 'admin'
  },
  user: 'movieServer',
  pass: 'hello',
})

module.exports = mg