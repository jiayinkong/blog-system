const router = require('koa-router')();
const { 
  getList, 
  getDetail, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} = require('../controller/blog');
const loginCheck = require('../midware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.prefix('/api/blog');

// 查询博客列表
router.get('/list', async function (ctx, next) {
  const { author = '', keyword = '' } = ctx.query;
  const username = ctx.session.username;

  // 未登录，管理员页面不展示博客列表
  if(ctx.query.isadmin && !username) {
    ctx.body = new ErrorModel('未登录');
    return;
  }

  // 如果是用户管理中心，展示的是自己的博客
  const queryAuthor = ctx.query.isadmin ? username : author;
  const listData = await getList(queryAuthor, keyword);

  ctx.body = new SuccessModel(listData);
})

// 查看博客详情
router.get('/detail', async function (ctx, next) {
  const detailData = await getDetail(ctx.query.id);

  ctx.body = new SuccessModel(detailData);
})

// 更新博客
router.post('/update', loginCheck, async function (ctx, next) {
  const updateData = await updateBlog(ctx.query.id, ctx.request.body);

  if(updateData) {
    ctx.body = new SuccessModel()
    return;
  }

  ctx.body = new ErrorModel('更新博客失败');
})

// 删除博客
router.post('/del', loginCheck, async function (ctx, next) {
  const author = ctx.session.username;
  const result = await deleteBlog(ctx.query.id, author);

  if(result) {
    ctx.body = new SuccessModel();
    return;
  }

  ctx.body = new ErrorModel('删除博客失败');
})

// 新建博客
router.post('/new', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username;
  const data = await createBlog(ctx.request.body);

  ctx.body = new SuccessModel(data)
});

module.exports = router
