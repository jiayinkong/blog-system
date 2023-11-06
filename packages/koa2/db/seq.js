const Sequelize = require('sequelize');
const { MYSQL_CONF } = require('../conf/db');


const conf = {
  host: MYSQL_CONF.hosts,
  dialect: 'mysql',
}

// 生产环境下使用连接池（process.env.NODE_ENV）
if(process.env.NODE_ENV === 'production') {
  conf.pool = {
    max: 4, // 连接池中最大的连接数
    min: 0, // 连接池中最小的连接数
    idle: 10 * 1000, // 如果一个连接 10s 内没有被使用，则释放
  }
}

// 创建 sequelize 实例
const seq = new Sequelize(
  MYSQL_CONF.databaseSeq, // 数据库名
  MYSQL_CONF.user, // 用户名
  MYSQL_CONF.password, // 密码
  conf,
)

// 测试连接
// seq.authenticate().then(() => {
//   console.log('sequelize connect success!')
// }).catch(() => {
//   console.log('sequelize connect failed...')
// })

module.exports = seq;