const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const morgan = require('koa-morgan')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')
const { REDIS_CONF } = require('./conf/db')
const ENV = process.env.NODE_ENV

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 处理日志
// 开发、测试环境
if(ENV !== 'production') {
  app.use((morgan('dev')));

// 线上环境
} else {
  // 写入流
  const logFilename = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFilename, {
    flags: 'a',
  });
  app.use(morgan('combined', { 
    stream: writeStream
  }))
}

// session 配置
app.keys = ['keyboard cat'];
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    all: `${REDIS_CONF.hosts}:${REDIS_CONF.port}`,
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
