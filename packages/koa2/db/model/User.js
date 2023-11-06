const Sequelize = require('sequelize');
const seq = require('../seq');

// User 模型
const User = seq.define(
  'user', // 对应同步到数据库的 users 表
  {
    // id 不用自定义，sequelize 会自动生成
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    realname: {
      type: Sequelize.STRING,
    }
  }
)

module.exports = User;