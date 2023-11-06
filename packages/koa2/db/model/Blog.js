const Sequelize = require('sequelize');
const seq = require('../seq');

// Blog 模型
const Blog = seq.define(
  'blog', // 对应同步到数据库的 blogs 表
  {
    // id 不用自定义，sequelize 会自动生成
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    }

    // createAt updateAt - sequelize 会自动创建
  }
)

module.exports = Blog;