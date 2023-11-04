const xss = require('xss');
const { exec, escape } = require('../db/mysql');

// 获取博客列表
const getList = (author, keyword) => {
  
  let sql = `select * from blogs where 1=1 `

  if(author) {
    sql += `and author = ${escape(author)} `;
  } 

  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }

  sql += `order by createTime desc;`;

  // 返回 promise
  return exec(sql);
}

// 获取博客详情
const getDetail = async (id) => {
  let sql = `select * from blogs where id=${escape(id)};`;
  const result = await exec(sql);
  return result[0];
}

// 新建博客
const createBlog = async (blogData = {})=> {
  const { title = '', content = '', author = '' } = blogData;
  const createTime = Date.now();

  const escapeTitle = escape(xss(title));
  const escapeContent = escape(xss(content));
  const escapeAuthor = escape(author);

  const sql = `insert into blogs (title, content, createTime, author) values (${escapeTitle}, ${escapeContent}, ${createTime}, ${escapeAuthor});`
  const insertData = await exec(sql);

  return {
    id: insertData.insertId,
  }
}

// 更新博客
const updateBlog = async (id, blogData = {}) => {
  const { title = '', content = '' } = blogData;
  const escapeId = escape(id);
  const escapeTitle = escape(xss(title));
  const escapeContent = escape(xss(content));

  const sql = `update blogs set title = ${escapeTitle}, content = ${escapeContent} where id=${escapeId}`;

  const updateData = await exec(sql);
  return !!(updateData.affectedRows > 0);
}

// 删除博客
const deleteBlog = async (id, author) => {
  const escapeId = escape(id);
  const escapeAuthor = escape(author);

  const sql = `delete from blogs where id=${escapeId} and author=${escapeAuthor};`;
  const delData = await exec(sql);
  return !!(delData.affectedRows > 0);
}
 
module.exports = {
  getList,
  getDetail,
  createBlog,
  updateBlog,
  deleteBlog,
}