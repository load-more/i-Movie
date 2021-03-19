let mg = require('../common/db')

let user = new mg.Schema({
  username: String,
  password: String,
  usermail: String,
  userphone: String,
  userAdmin: Boolean,
  userPower: Number,
  userStop: Boolean,
})

// 匹配所有
user.statics.findAll = function(callback) {
  this.find({}, callback)
}

// 使用用户名匹配
user.statics.findByUserName = function(name, callback) {
  this.find({username:name}, callback)
}

// 匹配没有处于封停的用户
user.statics.findUserLogin = function(name, password, callback) {
  this.find({username:name,password:password,userStop:false}, callback)
}

// 按照邮箱、电话和用户名匹配用户
user.statics.findUserPassword = function(name, mail, phone, callback) {
  this.find({username:name, usermail:mail, userphone:phone}, callback)
}

let userModel = mg.model('User', user)
module.exports = userModel
