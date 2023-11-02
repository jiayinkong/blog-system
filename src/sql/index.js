const mysql = require('mysql');

// 创建链接对象
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'myblog',
})

// 开始连接
connection.connect();

// 执行 sql 语句
const sql = 'select * from users';
connection.query(sql, (err, result) => {
  if(err) {
    console.log(err);
  } else {
    console.log(result);
  }
})

// 关闭连接
connection.end();
