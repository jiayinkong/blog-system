var express = require('express');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');
var router = express.Router();

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
    const result = await login(username, password);

    if (!result) {
      // 登录失败
      res.json(
        new ErrorModel('登录失败')
      )
      return;
    }

    // 登录成功
    const { username: resUsername = '', realname: resRealname = '' } = result;

    // 用户信息存储在 session 中
    req.session.username = resUsername;
    req.session.realname = resRealname;

    res.json(
      new SuccessModel(result)
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
