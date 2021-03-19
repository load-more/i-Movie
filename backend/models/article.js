let mg = require('../common/db')

let article = new mg.Schema({
  articleTitle: String,
  articleContext: String,
  articleTime: String
})

article.statics.findByArticleId = function(id, callback) {
  this.find({_id: id}, callback)
}

article.statics.findAll = function(callback) {
  this.find({}, callback)
}

let Article = mg.model('Article', article)
module.exports = Article
