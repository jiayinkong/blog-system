const router = require('koa-router')();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.prefix('/api/user');

router.post('/login', async (ctx) => {
  const { username = '', password = '' } = ctx.request.body;
  const result = await login(username, password);

  if (!result) {
    // 登录失败
    ctx.body = new ErrorModel('登录失败');
    return;
  }

  // 登录成功
  const { 
    username: resUsername = '', 
    realname: resRealname = '' 
  } = result;

  // 用户信息存储在 session 中
  ctx.session.username = resUsername;
  ctx.session.realname = resRealname;

  ctx.body = new SuccessModel(result);
});

router.get('/login-test', (ctx) => {

  const { username = '', realname = '' } = ctx.session;

  if(username) {
    ctx.body = new SuccessModel({
      username,
      realname,
    }, '已登录');
    return;
  }

  // 未登录
  ctx.body = new ErrorModel('未登录');
})

module.exports = router;
