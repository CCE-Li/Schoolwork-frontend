const mysql = require('mysql2');
require('dotenv').config({ path: __dirname + '/.env' });

// 创建数据库连接
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

const createTablesSQL = `
CREATE DATABASE IF NOT EXISTS ??;
USE ??;

CREATE TABLE IF NOT EXISTS admins (
  id INT NOT NULL AUTO_INCREMENT,
  admin_id BIGINT NOT NULL,
  username VARCHAR(32),
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY admins_pk (admin_id)
);

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  uid BIGINT NOT NULL,
  username VARCHAR(32),
  password VARCHAR(255) NOT NULL,
  status TINYINT NOT NULL DEFAULT '1',
  date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_pk (uid)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  uid BIGINT NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  phone BIGINT,
  address VARCHAR(255),
  prefer VARCHAR(255),
  PRIMARY KEY (uid)
);

CREATE TABLE IF NOT EXISTS books (
  id INT NOT NULL AUTO_INCREMENT,
  bid BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  description VARCHAR(255),
  tags VARCHAR(255),
  cover_url VARCHAR(255),
  price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  stock BIGINT NOT NULL DEFAULT '0',
  sales INT NOT NULL DEFAULT '0',
  status INT DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_favourites (
  id INT NOT NULL AUTO_INCREMENT,
  uid BIGINT NOT NULL,
  bid BIGINT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT NOT NULL AUTO_INCREMENT,
  uid BIGINT NOT NULL,
  bid BIGINT NOT NULL,
  rating INT NOT NULL,
  comment VARCHAR(500),
  review_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
`;

// 连接到MySQL
connection.connect((err) => {
  if (err) {
    console.error('连接MySQL失败: ' + err.stack);
    return;
  }

  console.log('成功连接到MySQL，连接ID: ' + connection.threadId);

  // 创建表
  connection.query(createTablesSQL, [process.env.DB_NAME, process.env.DB_NAME], (err, results) => {
    if (err) {
      console.error('创建表失败: ' + err.stack);
      connection.end();
      return;
    }

    console.log('表创建成功');
    
    // 插入测试数据
    const insertTestDataSQL = `
    INSERT IGNORE INTO admins (admin_id, username, password) VALUES (0, 'admin', 'admin123');
    
    INSERT IGNORE INTO users (uid, username, password) VALUES (1001, 'test', 'LIyixin20060203');
    
    INSERT IGNORE INTO user_profiles (uid, name, email, phone, address, prefer) 
    VALUES (1001, 'Test User', 'test@example.com', 1234567890, 'Test Address', 'fiction, technology');
    
    INSERT IGNORE INTO books (bid, title, author, description, tags, cover_url, price, stock, sales, status) 
    VALUES 
    (1, 'Vue.js设计与实现', '霍春阳', 'Vue.js源码解析', '编程,前端', '', 99.00, 100, 0, 1),
    (2, 'JavaScript高级程序设计', 'Nicholas C. Zakas', 'JavaScript经典教材', '编程,前端', '', 129.00, 100, 0, 1),
    (3, '你不知道的JavaScript', 'Kyle Simpson', '深入理解JavaScript', '编程,前端', '', 89.00, 100, 0, 1);
    `;
    
    connection.query(insertTestDataSQL, (err, results) => {
      if (err) {
        console.error('插入测试数据失败: ' + err.stack);
        connection.end();
        return;
      }

      console.log('测试数据插入成功');
      connection.end();
    });
  });
});