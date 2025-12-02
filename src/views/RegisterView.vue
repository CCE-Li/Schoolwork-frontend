<template>
  <el-col :lg="16">
    <div class="register-page">
      <div class="register-container">
        <h2>用户注册</h2>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username">用户名:</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="请输入用户名"
            />
          </div>

          <div class="form-group">
            <label for="email">邮箱:</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="请输入邮箱地址"
            />
          </div>

          <div class="form-group">
            <label for="password">密码:</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="请输入密码"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码:</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="请再次输入密码"
            />
          </div>

          <button type="submit" class="register-button">注册</button>
        </form>

        <div class="login-link">
          已有账户？<router-link to="/">返回首页</router-link>
        </div>
      </div>

      <!-- Logo和文字区域移到注册框下面 -->
      <div class="logo-text-container">
        <img alt="易购图书商城" src="@/assets/yigou.png" width="200" height="60" />
        <nav class="bottom-nav">
          <a href="#" class="nav-link">帮助</a>
          <span class="divider">|</span>
          <a href="#" class="nav-link">关于我们</a>
        </nav>
      </div>
    </div>
  </el-col>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = () => {

  if (form.password !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  // 模拟注册成功
  console.log('注册信息:', {
    username: form.username,
    email: form.email
  })

  alert('注册成功！')
  router.push('/') // 注册成功后跳转到首页
}
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 添加以垂直居中 */
  min-height: 100vh;
  padding: 1rem;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  box-sizing: border-box; /* 确保padding不影响宽度 */
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 1rem 0; /* 调整外边距 */
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.register-button {
  width: 100%;
  padding: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
  margin-top: 0.5rem;
}

.register-button:hover {
  background-color: #359c6d;
}

.login-link {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.logo-text-container {
  text-align: center;
  margin-top: 2rem; /* 纵向保持30px距离 */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px; /* 与注册框宽度一致 */
  margin: 0 auto; /* 水平居中 */
}

.logo-text-container img {
  margin-bottom: 1rem;
}

.bottom-nav {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.nav-link {
  text-decoration: none;
  color: #666;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #42b983;
}

.divider {
  color: #999;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 1.5rem;
    margin: 1rem 0;
  }

  h2 {
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  input {
    padding: 0.7rem;
    font-size: 0.9rem;
  }

  .register-button {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .logo-text-container img {
    width: 150px;
    height: auto;
  }

  .bottom-nav {
    font-size: 0.8rem;
  }
}
</style>
