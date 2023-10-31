const handleUserRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = req.path;

  if(method === 'POST' && path === '/api/user/login') {
    return {
      msg: '登录'
    }
  }
}

module.exports = handleUserRouter;