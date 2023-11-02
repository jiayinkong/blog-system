const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

// 创建链接对象
const connection = mysql.createConnection(MYSQL_CONF);

// 开始连接
connection.connect();

// 统一执行 sql 的函数
function exec(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
}

module.exports = {
  exec,
}