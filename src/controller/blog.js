// 获取博客列表
const getList = (author, keyword) => {
  return [
    {
      id: '123',
      title: '手撕 diff 算法',
      content: 'rrwerwenrmwentwerrte',
      createTime: '',
      author: 'jjy'
    },
    {
      id: '12333',
      title: '搭建基于 nodejs 的博客系统',
      content: 'rrwerwenrmwentwerrte',
      createTime: '',
      author: 'jjy'
    }
  ]
}

// 获取博客详情
const getDetail = (id) => {
  return {
    id: '123',
    title: '手撕 diff 算法',
    content: 'rrwerwenrmwentwerrte',
    createTime: '',
    author: 'jjy'
  }
}

// 新建博客
const createBlog = (blogData = {})=> {
  return {
    id: 12345, // 新建ID，表示插入数据表里的ID
  }
}

// 更新博客
const updateBlog = (id, blogData = {}) => {
  console.log('update', id, blogData)
  return true;
}

// 删除博客
const deleteBlog = (id) => {
  return true;
}
 
module.exports = {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
}