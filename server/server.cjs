const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/../.env' });
const { pool } = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 测试数据库连接
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    res.json({ message: '数据库连接成功!' });
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error);
    res.status(500).json({ error: '数据库连接失败', details: error.message });
  }
});

// 获取图书列表
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM books WHERE status = 1 LIMIT 20');
    res.json({ code: 200, data: rows, message: '获取图书列表成功' });
  } catch (error) {
    console.error('获取图书列表失败:', error);
    res.status(500).json({ code: 500, message: '获取图书列表失败', error: error.message });
  }
});

// 获取图书详情
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.promise().query('SELECT * FROM books WHERE bid = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: '图书不存在' });
    }
    
    res.json({ code: 200, data: rows[0], message: '获取图书详情成功' });
  } catch (error) {
    console.error('获取图书详情失败:', error);
    res.status(500).json({ code: 500, message: '获取图书详情失败', error: error.message });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 检查管理员账户
    const [adminRows] = await pool.promise().query(
      'SELECT * FROM admins WHERE username = ? AND password = ?', 
      [username, password]
    );
    
    if (adminRows.length > 0) {
      return res.json({
        code: 200,
        data: {
          token: 'admin-token-' + Date.now(),
          username: adminRows[0].username,
          role: 'admin'
        },
        message: '管理员登录成功'
      });
    }
    
    // 检查普通用户账户
    const [userRows] = await pool.promise().query(
      'SELECT * FROM users WHERE username = ? AND password = ?', 
      [username, password]
    );
    
    if (userRows.length > 0) {
      return res.json({
        code: 200,
        data: {
          token: 'user-token-' + Date.now(),
          username: userRows[0].username,
          role: 'user'
        },
        message: '用户登录成功'
      });
    }
    
    res.status(401).json({ code: 401, message: '用户名或密码错误' });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ code: 500, message: '登录失败', error: error.message });
  }
});

// 更新用户资料
app.post('/api/user/profile', async (req, res) => {
  try {
    // 这里应该从token中获取用户信息，简化处理
    res.json({ code: 200, message: '用户资料更新成功' });
  } catch (error) {
    console.error('更新用户资料失败:', error);
    res.status(500).json({ code: 500, message: '更新用户资料失败', error: error.message });
  }
});

// 更新用户密码
app.post('/api/user/password', async (req, res) => {
  try {
    // 这里应该验证旧密码，简化处理
    res.json({ code: 200, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ code: 500, message: '修改密码失败', error: error.message });
  }
});

// 获取用户收藏
app.get('/api/user/favorites', async (req, res) => {
  try {
    // 简化处理，返回空数组
    res.json({ code: 200, data: [], message: '获取收藏列表成功' });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({ code: 500, message: '获取收藏列表失败', error: error.message });
  }
});

// 获取浏览历史
app.get('/api/user/history', async (req, res) => {
  try {
    // 简化处理，返回空数组
    res.json({ code: 200, data: [], message: '获取浏览历史成功' });
  } catch (error) {
    console.error('获取浏览历史失败:', error);
    res.status(500).json({ code: 500, message: '获取浏览历史失败', error: error.message });
  }
});

// 获取推荐图书
app.get('/api/user/recommendations', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM books WHERE status = 1 ORDER BY RAND() LIMIT 8');
    res.json({ code: 200, data: rows, message: '获取推荐图书成功' });
  } catch (error) {
    console.error('获取推荐图书失败:', error);
    res.status(500).json({ code: 500, message: '获取推荐图书失败', error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});