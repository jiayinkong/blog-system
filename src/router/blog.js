const { getList, getDetail, createBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const path = req.path;
  const id = req.query.id;

  // 博客列表
  if(method === 'GET' && path === '/api/blog/list') {
    const { author = '', keyword = '' } = req.query;
    const listData = getList(author, keyword);

    return new SuccessModel(listData);
  }

  // 博客详情
  if(method === 'GET' && path === '/api/blog/detail') {
    const detailData = getDetail(id);
    return new SuccessModel(detailData);
  }

  // 更新博客
  if(method === 'POST' && path === '/api/blog/update') {
    const updateData = updateBlog(id, req.body);
    if(updateData) {
      return new SuccessModel();
    }
    return new ErrorModel('更新博客失败');
  }

  // 删除博客
  if(method === 'DELETE' && path === '/api/blog/delete') {
    const data = deleteBlog(id);
    if(data) {
      return new SuccessModel()
    } 
    return new ErrorModel('删除博客失败')
  }

  // 新建博客
  if(method === 'POST' && path === '/api/blog/new') {
    const data = createBlog(req.body);
    return new SuccessModel(data);
  }
}

module.exports = handleBlogRouter;