const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');

const login = async (username, password) => {
  username = escape(username);

  // 生成加密密码
  password = genPassword(password);

  // 防止 sql 注入
  password = escape(password);

  const sql = `select username, realname from users where username = ${username} and password = ${password};`;

  const result = await exec(sql);

  return result[0];
};

module.exports = {
  login,
};
