// 引入所需要的第三方包
const superagent= require('superagent');
const cheerio = require('cheerio');

const Movie = require('../models/movie')

for (var i = 0; i < 100; i++) {
  startIndex = 20 * i

  superagent.get('https://movie.douban.com/j/new_search_subjects')
  .query({
    sort: 'U',      // 排序方式
    range: '0,10',  // 评分区间
    tags: '电影',   // 类型
    start: startIndex,  // 开始索引，步长为20  
  })
  .end((err, res) => {
  if (err) {
    console.log(`抓取失败 - ${err}`)
  } else {
    let data = JSON.parse(res.text)
    console.log(data);
    for (i of data) {
      Movie.add(i)
      console.log(i);
    }
  }
  });   
}
