let mg = require('../common/db')

let recommend = new mg.Schema({
  recommendImage: String,
  recommendSrc: String,
  recommendTitle: String
})

// recommend.statics.findByIndexId = function(m_id, callback) {
//   this.find({})
// } 
recommend.statics.findAll = function(callback) {
  this.find({}, callback)
}

let Recommend = mg.model('Recommend', recommend)
module.exports = Recommend
