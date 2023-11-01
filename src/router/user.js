const { loginCheck } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = req.path;

  if(method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.query;
    const result = loginCheck(username, password);
    if(result) {
      return new SuccessModel();
    }
    return new ErrorModel('登录失败')
  }
}

module.exports = handleUserRouter;