const { getList, getDetail, createBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const loginCheck = (req) => {
  if(!req.session.username) {
    return Promise.resolve(
      new ErrorModel('未登录')
    )
  }
}

const handleBlogRouter = async (req, res) => {
  const method = req.method;
  const path = req.path;
  const id = req.query.id;
  const username = req.session.username;
  const loginCheckResult = loginCheck(req);

  // 博客列表
  if(method === 'GET' && path === '/api/blog/list') {
    const { author = '', keyword = '' } = req.query;
    const listData = await getList(author, keyword);

    return new SuccessModel(listData);
  }

  // 博客详情
  if(method === 'GET' && path === '/api/blog/detail') {
    const detailData = await getDetail(id);

    return new SuccessModel(detailData);
  }

  // 更新博客
  if(method === 'POST' && path === '/api/blog/update') {
    // 登录拦截
    if(loginCheckResult) {
      return loginCheckResult;
    }

    const updateData = await updateBlog(id, req.body);
    if(updateData) {
      return new SuccessModel();
    }
    return new ErrorModel('更新博客失败');
  }

  // 删除博客
  if(method === 'DELETE' && path === '/api/blog/delete') {
    // 登录拦截
    if(loginCheckResult) {
      return loginCheckResult;
    }

    const author = username;
    const data = await deleteBlog(id, author);
    if(data) {
      return new SuccessModel()
    } 
    return new ErrorModel('删除博客失败')
  }

  // 新建博客
  if(method === 'POST' && path === '/api/blog/new') {
    // 登录拦截
    if(loginCheckResult) {
      return loginCheckResult;
    }
    
    req.body.author = username;
    const data = await createBlog(req.body);

    return new SuccessModel(data);
  }
}

module.exports = handleBlogRouter;