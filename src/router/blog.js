const handleBlogRouter = (req, res) => {
  const method = req.method;
  const path = req.path;

  // 博客列表
  if(method === 'GET' && path === '/api/blog/list') {
    return {
      msg: '请求博客列表'
    }
  }

  // 博客详情
  if(method === 'POST' && path === '/api/blog/detail') {
    return {
      msg: '请求博客详情'
    }
  }

  // 更新博客
  if(method === 'POST' && path === '/api/blog/update') {
    return {
      msg: '更新博客'
    }
  }

  // 删除博客
  if(method === 'POST' && path === '/api/blog/delete') {
    return {
      msg: '删除博客'
    }
  }

  if(method === 'POST' && path === '/api/blog/new') {
    return {
      msg: '新增博客'
    }
  }
}

module.exports = handleBlogRouter;