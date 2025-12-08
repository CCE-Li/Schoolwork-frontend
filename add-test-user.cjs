const mysql = require('mysql2');
require('dotenv').config({ path: __dirname + '/.env' });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// 创建数据库连接
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('连接数据库失败: ' + err.stack);
    return;
  }

  console.log('成功连接到数据库，连接ID: ' + connection.threadId);

  // 插入测试用户
  const testUser = {
    uid: 1001,
    username: 'test',
    password: 'LIyixin20060203',
    status: 1
  };

  // 检查用户是否已存在
  connection.query('SELECT * FROM users WHERE username = ?', [testUser.username], (err, results) => {
    if (err) {
      console.error('查询用户失败: ' + err.stack);
      connection.end();
      return;
    }

    if (results.length > 0) {
      console.log('测试用户已存在');
      connection.end();
      return;
    }

    // 插入新用户
    connection.query('INSERT INTO users SET ?', testUser, (err, results) => {
      if (err) {
        console.error('插入用户失败: ' + err.stack);
        connection.end();
        return;
      }

      console.log('测试用户插入成功，用户ID: ' + results.insertId);
      
      // 插入用户资料
      const userProfile = {
        uid: testUser.uid,
        name: 'Test User',
        email: 'test@example.com',
        phone: 1234567890,
        address: 'Test Address',
        prefer: 'fiction, technology'
      };

      connection.query('INSERT INTO user_profiles SET ?', userProfile, (err, results) => {
        if (err) {
          console.error('插入用户资料失败: ' + err.stack);
          connection.end();
          return;
        }

        console.log('用户资料插入成功');
        connection.end();
      });
    });
  });
});