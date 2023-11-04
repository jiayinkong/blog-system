var express = require('express');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');
var router = express.Router();

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
    const result = await login(username, password);

    // 登录成功
    if (result) {
      // 用户信息存储在 session 中
      const { username = '', realname = '' } = result;
      req.session.username = username;
      req.session.realname = realname;

      res.json(
        new SuccessModel(result)
      )
      return;
    }

    // 登录失败
    res.json(
      new ErrorModel('登录失败')
    )
});

router.get('/login-test', (req, res) => {
  const { username = '', realname = '' } = req.session;

  if(username) {
    res.json(
      new SuccessModel({
        username,
        realname,
      }, '已登录')
    );
    return;
  }

  // 未登录
  res.json(
    new ErrorModel('未登录')
  )
})

module.exports = router;
