<template>
  <div class="register-page">
    <!-- 左侧装饰区域 -->
    <div class="left-panel">
      <div class="content">
        <h1>加入我们</h1>
        <p>成为易购图书商城的一员</p>
      </div>
    </div>

    <!-- 右侧注册表单 -->
    <div class="right-panel">
      <div class="form-wrapper">
        <div class="register-container">
          <h2>用户注册</h2>

          <form class="register-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="username">用户名:</label>
              <el-input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                size="large"
                clearable
              />
            </div>

            <div class="form-group">
              <label for="email">邮箱:</label>
              <el-input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱地址"
                size="large"
                clearable
              />
            </div>

            <div class="form-group">
              <label for="password">密码:</label>
              <el-input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">确认密码:</label>
              <el-input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                size="large"
                show-password
              />
            </div>

            <button type="submit" class="register-button">
              注册
            </button>
          </form>

          <div class="login-link">
            <span>已有账户？</span>
            <a @click="goToLogin">立即登录</a>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="logo-text-container">
          <img alt="易购图书商城" src="@/assets/yigou.png" />
          <nav class="bottom-nav">
            <a href="#" class="nav-link">帮助</a>
            <span class="divider">|</span>
            <a href="#" class="nav-link">关于我们</a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElMessage } from 'element-plus'

const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = () => {
  // 这里应该添加实际的注册逻辑
  if (form.password !== form.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  // 模拟注册成功
  console.log('注册信息:', {
    username: form.username,
    email: form.email
  })

  ElMessage.success({
    message: '注册成功！',
    duration: 2000,
    onClose: () => {
      // 注册成功后跳转到登录界面
      router.push('/login')
    }
  })
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  z-index: 1;
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
  cursor: pointer;
}

.login-link a:hover {
  text-decoration: underline;
}

.logo-text-container {
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
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

/* 左侧装饰区域 */
.left-panel {
  display: flex;
  width: 66.666%;
  background: linear-gradient(to bottom right, #22c55e, #0d9488);
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.left-panel .content {
  color: white;
  text-align: center;
}

.left-panel h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.left-panel p {
  font-size: 1.25rem;
}

/* 右侧表单区域 */
.right-panel {
  width: 33.333%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f9fafb;
}

.form-wrapper {
  width: 100%;
  max-width: 28rem;
}

/* 响应式布局 */
@media (min-width: 768px) {
  .left-panel {
    display: flex;
  }
}

/* 全屏适配 */
@media (min-width: 1024px) {
  .register-page {
    height: 100vh;
    width: 100vw;
  }
}

@media (max-width: 768px) {
  .register-page {
    flex-direction: column;
  }

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

@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .register-button {
    padding: 0.7rem;
    font-size: 0.85rem;
  }
}
</style>
