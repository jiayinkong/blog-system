const env = process.env.NODE_ENV;

let MYSQL_CONF;

// 开发环境的配置
if(env === 'development') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'myblog',
  }
}

// 生产环境的配置
if(env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'myblog',
  }
}

module.exports = {
  MYSQL_CONF
}