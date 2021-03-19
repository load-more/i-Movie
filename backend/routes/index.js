let express = require('express');
let router = express.Router();
let mg = require('mongoose')
let Recommend = require('../models/recommend')
let Movie = require('../models/movie');
const Article = require('../models/article');
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 获取所有电影
router.get('/movies', (req, res, next) => {
  Movie.findAll((err, allMovies) => {
    if (err) {
      res.json({status: 1, message: '获取所有电影失败', data: err})
    }
    res.json({status: 0, message: '获取所有电影成功', data: allMovies})
  })
})

// 获取推荐
router.get('/showIndex', (req, res, next) => {
  Recommend.findAll((err, recommends) => {
    res.json({status: 0, message: '获取推荐成功', data: recommends})
  })
})
// 获取首页
router.get('/showRanking', (req, res, next) => {
  Movie.find({movieMainPage:true}, (err, movies) => {
    res.json({status: 0, message: '获取首页成功', data: movies})
  })
})
// 获取文章列表
router.get('/showArticle', (req, res, next) => {
  Article.findAll((err, articles) => {
    res.json({status: 0, message: '获取文章列表成功', data: articles})
  })
})
// 获取文章详情
router.post('/articleDetail', (req, res, next) => {
  if (!req.body.article_id) {
    res.json({status: 1, message: '文章id为空'})
  } else {
    Article.findByArticleId(req.body.article_id, (err, data) => {
      res.json({status: 0, message: '获取文章详情成功', data: data})
    })
  }
})
// 获取用户个人信息
router.post('/showUser', (req, res, next) => {
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户id为空'})
  } else {
    User.find({_id: req.body.user_id}, (err, user) => {
      res.json({status: 0, message: '用户信息获取成功', data: user})
    })
  }
})

module.exports = router;
