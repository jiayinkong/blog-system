const xss = require('xss');
const Sequelize = require('sequelize');
const Blog = require('../db/model/Blog');

// 获取博客列表
const getList = async (author = '', keyword = '') => {
  const whereOpt = {};
  if(author) {
    whereOpt.author = author;
  }
  if(keyword) {
    whereOpt.title = {
      [Sequelize.Op.like]: `%${keyword}%`
    }
  }
  
  const list = await Blog.findAll({
    where: whereOpt,
    order: [
      ['id', 'desc']
    ]
  });

  return list.map(item => item.dataValues);
}

// 获取博客详情
const getDetail = async (id) => {
  const blog = await Blog.findOne({
    where: {
      id,
    }
  });

  if(!blog) {
    return null;
  }

  return blog.dataValues;
}

// 新建博客
const createBlog = async (blogData = {})=> {
  const title = xss(blogData.title);
  const content = xss(blogData.content);
  const author = blogData.author; 

  const blog = await Blog.create({
    title,
    content,
    author,
  });

  if(!blog) {
    return null;
  }

  return {
    id: blog.dataValues.id,
  }
}

// 更新博客
const updateBlog = async (id, blogData = {}) => {
  const title = xss(blogData.title);
  const content = xss(blogData.content);

  const res = await Blog.update({
    title,
    content,
  },
  {
    where: {
      id,
    }
  });

  return res[0] >= 1;
}

// 删除博客
const deleteBlog = async (id, author) => {
  const res = await Blog.destroy({
    where: {
      id,
      author,
    }
  });

  return res >= 1;
}
 
module.exports = {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
}