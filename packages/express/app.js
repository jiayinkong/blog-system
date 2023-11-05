const path = require('path');
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const app = express();
const ENV = process.env.NODE_ENV;

// 处理日志
// 开发、测试环境
if(ENV !== 'production') {
  app.use((logger('dev')));

// 线上环境
} else {
  // 写入流
  const logFilename = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFilename, {
    flags: 'a',
  });
  app.use(logger('combined', { 
    stream: writeStream
  }))
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 处理 session，存到 redis 
const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

app.use(
  session({
    store: sessionStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    }
  })
)

// 路由
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
