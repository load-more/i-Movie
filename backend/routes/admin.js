let express = require('express');
let router = express.Router();
let User = require('../models/user')
let Movie = require('../models/movie')

router.get('/addMovie', (req, res, next) => {
  // 验证数据的完整性
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登录出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: 'id为空'})
  }
  if (!req.body.movieName) {
    res.json({status: 1, message: '电影名为空'})
  }
  if (!req.body.movieImage) {
    res.json({status: 1, message: '电影图片为空'})
  }
  if (!req.body.movieDownload) {
    res.json({status: 1, message: '电影下载地址为空'})
  }
  // 如果数据验证成功，则进行数据处理
  if (!req.body.movieMainPage) {
    var movieMainPage = false
  }

  // 验证用户的后台管理权限
  let check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error === 0) {
    User.findByUserName(req.body.username, (err, user) => {
      if (user[0].userAdmin && !user[0].userStop) {
        // 如果用户有管理员权限并且没有被封停，则存入新的数据
        new Movie({
          movieName: req.body.movieName,
          movieImage: req.body.movieImage,
          movieVideo: req.body.movieVideo,
          movieDownload: req.body.movieDownload,
          movieTime: Date.now(),
          movieNumSuppose: 0,
          movieNumDownload: 0,
          movieMainPage: movieMainPage,
        }).save().then(res => {
          res.json({status: 0, message: '添加成功'}) 
        }, err => {
          res.json({status: 1, message: '添加失败', data: err})
        })
      } else {
        res.json({status: 1, message: '用户没有管理权限或已被停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})

module.exports = router
