<template>
  <div class="login-page">
    <!-- 左侧装饰区域 -->
    <div class="left-panel">
      <div class="content">
        <h1>欢迎来到易购图书商城</h1>
        <p>一站式图书购物平台</p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="right-panel">
      <div class="form-wrapper">
        <div class="login-container">
          <h2>用户登录</h2>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">用户名:</label>
              <el-input
                id="username"
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名"
                size="large"
                clearable
              />
            </div>

            <div class="form-group">
              <label for="password">密码:</label>
              <el-input
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
              />
            </div>

            <!-- 登录类型选择 -->
            <div class="form-group">
              <label>登录类型:</label>
              <el-radio-group v-model="loginForm.userType" class="radio-group">
                <el-radio-button label="user">用户登录</el-radio-button>
                <el-radio-button label="admin">管理员登录</el-radio-button>
              </el-radio-group>
            </div>

            <button type="submit" class="login-button">
              登录
            </button>
          </form>

          <div class="register-link">
            <span>还没有账户？</span>
            <a @click="goToRegister">立即注册</a>
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

  <!-- 自定义通知组件 -->
  <el-dialog
    v-model="showNotification"
    :show-close="false"
    width="400px"
    center
    class="notification-dialog"
  >
    <div class="notification-content">
      <p>{{ notificationMessage }}</p>
    </div>
    <template #footer>
      <div class="notification-footer">
        <el-button type="primary" @click="closeNotification">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElRadioGroup, ElRadioButton, ElDialog, ElButton } from 'element-plus'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
  userType: 'user' // 默认为用户登录
})

const showNotification = ref(false)
const notificationMessage = ref('')
let notificationTimer = null

// 关闭通知
const closeNotification = () => {
  showNotification.value = false
  clearTimeout(notificationTimer)
}

const handleLogin = () => {
  // 模拟登录验证
  console.log('登录信息:', {
    username: loginForm.username,
    password: loginForm.password,
    userType: loginForm.userType
  })

  // 管理员登录逻辑
  if (loginForm.userType === 'admin') {
    // 模拟管理员账号密码验证
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      // 管理员登录成功，跳转到后台首页
      router.push('/admin/dashboard')
    } else {
      // 管理员账号密码错误
      notificationMessage.value = '无权限：账号或密码错误'
      showNotification.value = true
    }
  } else {
    // 普通用户登录逻辑
    // 模拟用户账号密码验证（这里可以是任意非空的用户名和密码）
    if (loginForm.username && loginForm.password) {
      // 用户登录成功，跳转到首页
      router.push('/home')
    } else {
      // 用户账号密码错误
      notificationMessage.value = '登录失败：请填写正确的用户名和密码'
      showNotification.value = true

      // 清除可能存在的定时器
      if (notificationTimer) {
        clearTimeout(notificationTimer)
      }

      // 3秒后自动关闭通知
      notificationTimer = setTimeout(() => {
        showNotification.value = false
      }, 3000)
    }
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}

/* 左侧装饰区域 */
.left-panel {
  display: flex;
  width: 66.666%;
  background: linear-gradient(to bottom right, #3b82f6, #4338ca);
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

.login-container {
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
}

.login-form {
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

.radio-group {
  width: 100%;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
  margin-top: 0.5rem;
}

.login-button:hover {
  background-color: #2563eb;
}

.register-link {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.register-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

.logo-text-container {
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-text-container img {
  width: 160px;
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
  color: #3b82f6;
}

.divider {
  color: #999;
}

/* 通知弹窗样式 */
.notification-content {
  text-align: center;
  padding: 1rem;
}

.notification-content p {
  font-size: 1.1rem;
}

.notification-footer {
  text-align: center;
}

/* Element Plus主题定制 */
:deep(.el-radio-button__inner) {
  width: 120px;
  text-align: center;
}

/* 响应式布局 */
@media (min-width: 768px) {
  .left-panel {
    display: flex;
  }
}

/* 全屏适配 */
@media (min-width: 1024px) {
  .login-page {
    height: 100vh;
    width: 100vw;
  }
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-container {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .login-button {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .logo-text-container img {
    width: 150px;
  }

  .bottom-nav {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .login-button {
    padding: 0.7rem;
    font-size: 0.85rem;
  }

  :deep(.el-radio-button__inner) {
    width: 100px;
    font-size: 0.85rem;
  }
}
</style>
