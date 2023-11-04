const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { set } = require('../db/redis');

const handleUserRouter = async (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = req.path;

  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body;
    const result = await login(username, password);

    // 登录成功
    if (result) {
      // 用户信息存储在 session 中
      const { username = '', realname = '' } = result;
      req.session.username = username;
      req.session.realname = realname;

      // 存到 redis 内存中
      await set(req.sessionId, JSON.stringify(req.session));

      return new SuccessModel(result);
    }

    // 登录失败
    return new ErrorModel("登录失败");
  }

  // 登录验证
  if(method === 'GET' && req.path === '/api/user/login-test') {

    // 已登录
    if(req.session.username) {
      return new SuccessModel(req.session, '已登录');
    }

    // 未登录
    return new ErrorModel('未登录');
  }
};

module.exports = handleUserRouter;
