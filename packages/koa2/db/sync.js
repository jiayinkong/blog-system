const seq = require('./seq');

// 需要同步的模型
require('./model/Blog')
require('./model/User')

seq.authenticate().then(() => {
  console.log('sequelize connect success!');
}).catch(() => {
  console.error('sequelize connect failed...');
})

// 同步数据
seq.sync({ force: true }).then(() => {
  process.exit() // 退出进程
})