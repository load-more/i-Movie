let mg = require('../common/db')

let movie = new mg.Schema({
  directors: Array,
  rate: String,
  cover_x: Number,
  star: String,
  title: String,
  url: String,
  casts: Array,
  cover: String,
  id: String,
  cover_y: Number,
})

let movieModel = mg.model('Movie', movie)

let Movie = {
  add(params) {
    new movieModel(params)
      .save()
      .then(
        (res) => console.log(res),
        (err) => console.log(err)
      )
  },
  findById(id, callback) {
    movieModel.find({_id: id}, callback)
  },
  findAll(callback) {
    movieModel.find({}, callback)
  }
}

module.exports = Movie
