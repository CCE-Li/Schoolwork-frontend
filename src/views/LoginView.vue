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
      router.push('/shop')
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
  overflow: hidden;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
}

/* 左侧装饰区域 */
.left-panel {
  display: flex;
  flex: 1;
  min-width: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #4338ca 50%, #6366f1 100%);
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

/* 装饰背景效果 */
.left-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.left-panel .content {
  color: white;
  text-align: center;
  z-index: 1;
  max-width: 500px;
}

.left-panel h1 {
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.left-panel p {
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  opacity: 0.9;
}

/* 右侧表单区域 */
.right-panel {
  width: 480px;
  min-width: 400px;
  max-width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f9fafb;
  flex-shrink: 0;
  overflow-y: auto;
  box-sizing: border-box;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-container {
  width: 100%;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  border: 1px solid #e5e7eb;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.radio-group {
  width: 100%;
}

.login-button {
  width: 100%;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 0.75rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.login-button:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
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
  width: 140px;
  text-align: center;
  padding: 10px 16px;
}

:deep(.el-input__wrapper) {
  padding: 8px 12px;
}

:deep(.el-input--large .el-input__wrapper) {
  padding: 10px 14px;
}

/* 超大屏幕适配 (1920px+) */
@media (min-width: 1920px) {
  .right-panel {
    width: 520px;
    padding: 3rem;
  }

  .login-container {
    padding: 3rem;
  }

  h2 {
    font-size: 2rem;
  }

  .left-panel h1 {
    font-size: 3.5rem;
  }

  .left-panel p {
    font-size: 1.5rem;
  }
}

/* 大屏幕适配 (1440px - 1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .right-panel {
    width: 500px;
  }

  .login-container {
    padding: 2.5rem;
  }
}

/* 中等屏幕适配 (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .right-panel {
    width: 450px;
    min-width: 380px;
  }

  .login-container {
    padding: 2rem;
  }
}

/* 平板适配 (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .login-page {
    flex-direction: row;
  }

  .left-panel {
    flex: 1;
    padding: 2rem;
  }

  .left-panel h1 {
    font-size: 1.8rem;
  }

  .left-panel p {
    font-size: 1rem;
  }

  .right-panel {
    width: 380px;
    min-width: 340px;
    padding: 1.5rem;
  }

  .login-container {
    padding: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  :deep(.el-radio-button__inner) {
    width: 110px;
    padding: 8px 12px;
  }
}

/* 移动端适配 (小于768px) */
@media (max-width: 767px) {
  .login-page {
    flex-direction: column;
  }

  .left-panel {
    min-height: 180px;
    padding: 2rem 1.5rem;
    flex: none;
  }

  .left-panel h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .left-panel p {
    font-size: 0.95rem;
  }

  .right-panel {
    width: 100%;
    min-width: unset;
    max-width: unset;
    flex: 1;
    padding: 1.5rem;
  }

  .form-wrapper {
    max-width: 100%;
  }

  .login-container {
    padding: 1.5rem;
    border-radius: 12px;
  }

  h2 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .login-button {
    padding: 0.75rem;
    font-size: 0.95rem;
  }

  .logo-text-container img {
    width: 140px;
  }

  .bottom-nav {
    font-size: 0.85rem;
  }

  :deep(.el-radio-button__inner) {
    width: 110px;
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}

/* 小屏手机适配 (小于480px) */
@media (max-width: 480px) {
  .left-panel {
    min-height: 150px;
    padding: 1.5rem 1rem;
  }

  .left-panel h1 {
    font-size: 1.3rem;
  }

  .left-panel p {
    font-size: 0.85rem;
  }

  .right-panel {
    padding: 1rem;
  }

  .login-container {
    padding: 1.25rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  .login-button {
    padding: 0.7rem;
    font-size: 0.9rem;
  }

  :deep(.el-radio-button__inner) {
    width: 100px;
    font-size: 0.85rem;
    padding: 6px 10px;
  }

  .logo-text-container {
    margin-top: 1.5rem;
  }

  .logo-text-container img {
    width: 120px;
  }
}
</style>
