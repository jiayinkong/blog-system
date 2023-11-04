let express = require('express');
let router = express.Router();

const { getList, getDetail, createBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 查询博客列表
router.get('/list', async (req, res, next) => {
  const { author = '', keyword = '' } = req.query;

    let currentAuthor = author;

    // // 如果是用户管理中心，展示的是自己的博客
    // if(req.query.isadmin) {
    //   const loginCheckResult = loginCheck(req);
    //   if(loginCheckResult) {
    //     // 未登录
    //     return loginCheckResult;
    //   }
    //   // 强制查询自己的博客
    //   currentAuthor = username;
    // }

    const listData = await getList(currentAuthor, keyword);

    res.json(
      new SuccessModel(listData)
    )
});

// 查看博客详情
router.get('/detail', async (req, res, next) => {
  const detailData = await getDetail(req.query.id);

  res.json(
    new SuccessModel(detailData)
  )
});

// 更新博客
router.post('/update', async (req, res, next) => {
  // 登录拦截 TODO

  const updateData = await updateBlog(req.query.id, req.body);

  if(updateData) {
    res.json(
      new SuccessModel()
    );
    return;
  }

  res.json(
    new ErrorModel('更新博客失败')
  )
});

// 删除博客
router.post('/del', async (req, res, next) => {
  // 登录拦截 TODO

  const author = req.session.username;
  const result = await deleteBlog(req.query.id, author);

  if(result) {
    res.json(
      new SuccessModel()
    );
    return;
  }

  res.json(
    new ErrorModel('删除博客失败')
  )
});

// 新建博客
router.post('/new', async (req, res, next) => {
  // 登录拦截 TODO
  req.body.author = req.session.username;
  const data = await createBlog(req.body);

  res.json(
    new SuccessModel(data)
  )
});

module.exports = router;
