let mg = require('../common/db')

let comment = new mg.Schema({
  movie_id: String,
  username: String,
  context: String,
  check: Boolean
})

comment.statics.findByMovieId = function(m_id, callback) {
  this.find({movie_id: m_id, check: true}, callback)
}
comment.statics.findAll = function(callback) {
  this.find({}, callback)
}

let commentModel = mg.model('Comment', comment)
module.exports = commentModel
