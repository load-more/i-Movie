let express = require('express');
let router = express.Router();
let user = require('../models/user')
let crypto = require('crypto')
let comment = require('../models/comment')
let movie = require('../models/movie');
const mail = require('../models/mail');

const init_token = 'TKL02o'

/* 
  {
    status: 0为正常，1为出错
    message：提示语
    data：传送的数据
  }
*/

// 用户登录接口
router.post('/login', function(req, res, next) {
  // 验证完整性，可以用正则表达式对输入的格式进行验证
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.password) {
    res.json({status: 1, message: '密码为空'})
  }
  user.findUserLogin(req.body.username, req.body.password, function(err, userSave) {
    if (userSave.length) {
      // 通过 MD5 查看密码
      let token_after = getMD5Password(userSave[0]._id)
      res.json({status: 0, message: '用户登录成功', data: {token:token_after,user:userSave}})
    } else {
      res.json({status: 1, message: '用户名或密码错误'})
    }
  })
});
// 用户注册接口
router.post('/register', function(req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.password) {
    res.json({status: 1, message: '密码为空'})
  }
  if (!req.body.usermail) {
    res.json({status: 1, message: '邮箱地址为空'})
  }
  if (!req.body.userphone) {
    res.json({status: 1, message: '手机号码为空'})
  }
  user.findByUserName(req.body.username, function(err, userSave) {
    if (userSave.length) {
      res.json({status: 1, message: '用户名已注册'})
    } else {
      new user({
        username: req.body.username,
        password: req.body.password,
        usermail: req.body.usermail,
        userphone: req.body.userphone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      }).save().then(() => {
        res.json({status: 0, message: '注册成功'})
      })
    }
  })
})
// 用户提交评论
router.post('/postComment', function(req, res, next) {
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id为空'})
  }
  if (!req.body.context) {
    res.json({status: 1, message: '评论内容为空'})
  }
  new comment({
    movie_id: req.body.movie_id,
    username: req.body.username ? req.body.username : '匿名用户',
    context: req.body.context,
    check: 0
  }).save().then(res => {
    res.json({status: 0, message: '评论成功', data: res})
  })
})
// 用户点赞
router.post('/support', function(req, res, next) {
  if (!req.body.movie_id) {
    res.json({status:1, message: '电影id传递失败'})
  }
  movie.findById(req.body.movie_id, function(err, movieFound) {
    movie.updateOne({_id: req.body.movie_id}, {movieNumSuppose:movieFound[0].movieNumSuppose+1}, function(err) {
      if (err) {
        res.json({status: 1, message: '点赞失败', data: err})
      } else {
        res.json({status: 0, message: '点赞成功'})
      }
    })
  })
})
// 用户找回密码
/* 
  - 输入 mail、phone、username验证身份
*/
router.post('/findPassword', function(req, res, next) {
  if (req.body.repassword) {
    // 当repassword存在时，验证登录情况或者验证code
    if (req.body.token) {
      if (!req.body.user_id) {
        res.json({status: 1, message: '用户登录错误'})
      }
      if (!req.body.password) {
        res.json({status: 1, message: '用户旧密码错误'})
      }
      if (req.body.token === getMD5Password(req.body.user_id)) {
        user.findOne({_id: req.body.user_id, password: req.body.repassword}, function(err, checkUser) {
          if (checkUser) {
            user.updateOne({_id:req.body.user_id},{password:req.body.repassword},function(err, userUpdate) {
              if (err) {
                res.json({status: 1, message: '更改错误', data: err})
              } else {
                res.json({status: 0, message: '更改成功', data: userUpdate})
              }
            })
          } else {
            res.json({status: 1, message: '用户登录错误'})
          }
        })
      } else {
        user.finUserPassword(req.body.username,req.body.usermail,req.body.userphone, function(err, userFound) {
          if (userFound.length) {
            user.updateOne({_id: userFound[0]._id}, {password: req.body.repassword}, function(err, userUpdate) {
              if (err) {
                res.json({status: 1, message: '更改错误', data: err})
              } else {
                res.json({status: 0, message: '更改成功', data:userUpdate})
              }
            })
          } else {
            res.json({status: 1, message: '信息错误'})
          }
        })
      }
    }
  } else {
    if (!req.body.username) {
      res.json({status: 1, message: '用户名为空'})
    }
    if (!req.body.usermail) {
      res.json({status: 1, message: '用户邮箱为空'})
    }
    if (!req.body.userphone) {
      res.json({status: 1, message: '用户手机号码为空'})
    }
    user.findUserPassword(req.body.username,req.body.usermail,req.body.userphone,function(err, userFound) {
      if (userFound.length) {
        res.json({status: 0, message: '验证成功，请修改密码', data: {
          username: req.body.username,
          usermail: req.body.usermail,
          userphone: req.body.userphone,
        }})
      } else {
        res.json({status: 1, message: '信息错误'})
      }
    })
  }
})
// 下载路由
router.post('/download', function(req, res, next) {
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id为空'})
  } else {
    movie.findById(req.body.movie_id, function(err, movieFound) {
      if (err) {
        res.json({status: 1, message: '查找失败', data: err})
      } else {
        movie.updateOne({_id: req.body.movie_id},{movieNumDownload:movieFound[0].movieNumDownload+1}, function(err) {
          if (err) {
            res.json({status: 1, message: '下载失败', data: err})
          } else {
            res.json({status: 0, message: '下载成功'})
          }
        })
      }
    })
  }
})

// 用户发送站内信
router.post('/sendEmail', function(req, res, next) {
  if (!req.body.token) {
    res.json({status: 1, message: '用户登录状态错误'})
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户登录状态出错'})
  }
  if (!req.body.toUserName) {
    res.json({status: 1, message: '未选择相关用户'})
  }
  if (!req.body.title) {
    res.json({status: 1, message: '标题为空'})
  }
  if (!req.body.context) {
    res.json({status: 1, message: '内容为空'})
  }
  console.log(getMD5Password(req.body.user_id));
  if (req.body.token === getMD5Password(req.body.user_id)) {
    user.findByUserName(req.body.toUserName, function(err, toUser) {
      if (toUser.length) {
        mail({
          fromUser: req.body.user_id,
          toUser: req.body.toUserName,
          title: req.body.title,
          context: req.body.context
        }).save().then(res => {
          res.json({status: 0, message: '发送成功'})
        })
      } else {
        res.json({status: 1, message: '发送对象不存在'})
      }
    })
  } else {
    res.json({status: 1, message: '用户登录错误'})
  }
})
// 用户接收站内信
router.post('/showEmail', function(req, res, next) {
  if (!req.body.token) {
    res.json({status: 1, message: '用户登录状态错误'})
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '没有用户id'})
  }
  if (!req.body.receive) {
    res.json({status: 1, message: '参数出错'})
  }
  if (req.body.token === getMD5Password(req.body.user_id)) {
    if (receive === 0) {  // 获取收到的站内信
      mail.findByToUserName(req.body.userName, function(err, mailReceived) {
        res.json({status: 0, message: '获取成功', data: mailReceived})
      })
    } else {              // 获取发送的站内信
      mail.findByFromUserId(req.body.user_id, function(err, mailSent) {
        res.json({status: 0, message: '获取成功', data: mailSent})
      })
    }
  } else {
    res.json({status: 1, message: '用户登录错误'})
  }
})

// 获取 MD5
/* 
  在验证用户的用户名和密码时，如果用户不属于封停用户，则返回一个相应的Token值作为用户的登录状态，此值在所有的登录操作中
  都需要作为参数携带;
  此Token值是由用户的id和一个固定的字符串连接后，通过MD5生成的一个加密值；
*/
function getMD5Password(id) {
  let md5 = crypto.createHash('md5')
  let token_before = id + init_token
  return md5.update(token_before).digest('hex')
}

module.exports = router;
