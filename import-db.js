const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();

// 读取SQL文件
const sql = fs.readFileSync('./bookstore_2025-12-08_193806.sql', 'utf8');

// 创建数据库连接
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

// 连接到MySQL
connection.connect((err) => {
  if (err) {
    console.error('连接MySQL失败: ' + err.stack);
    return;
  }

  console.log('成功连接到MySQL，连接ID: ' + connection.threadId);

  // 创建数据库
  connection.query('CREATE DATABASE IF NOT EXISTS bookstore', (err, results) => {
    if (err) {
      console.error('创建数据库失败: ' + err.stack);
      connection.end();
      return;
    }

    console.log('数据库创建成功或已存在');
    
    // 选择数据库
    connection.changeUser({database : 'bookstore'}, (err) => {
      if (err) {
        console.error('切换数据库失败: ' + err.stack);
        connection.end();
        return;
      }

      console.log('已切换到bookstore数据库');

      // 执行SQL文件
      connection.query(sql, (err, results) => {
        if (err) {
          console.error('执行SQL文件失败: ' + err.stack);
          connection.end();
          return;
        }

        console.log('SQL文件执行成功');
        connection.end();
      });
    });
  });
});