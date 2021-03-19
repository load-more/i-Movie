let mg = require('mongoose')

let mail = new mg.Schema({
  fromUser: String,
  toUser: String,
  title: String,
  context: String
})

mail.statics.findByFromUserId = function(id, callback) {
  this.find({fromUser: id}, callback)
}
mail.statics.findByToUserName = function(name, callback) {
  this.find({toUser: name}, callback)
}
 
let mailModel = mg.model('Mail', mail)
module.exports = mailModel
