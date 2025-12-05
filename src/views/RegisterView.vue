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

            <button type="submit" class="register-button" :disabled="isLoading">
              {{ isLoading ? '注册中...' : '注册' }}
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)

// 密码强度验证
const validatePassword = (password) => {
  if (password.length < 8) {
    return '密码长度至少8位'
  }
  if (!/[a-z]/.test(password)) {
    return '密码需要包含小写字母'
  }
  if (!/[A-Z]/.test(password)) {
    return '密码需要包含大写字母'
  }
  if (!/[0-9]/.test(password)) {
    return '密码需要包含数字'
  }
  return null
}

// 邮箱格式验证
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleRegister = async () => {
  // 表单验证
  if (!form.username || !form.email || !form.password || !form.confirmPassword) {
    ElMessage.error('请填写所有必填项')
    return
  }

  // 用户名验证
  if (form.username.length < 3) {
    ElMessage.error('用户名长度至少3位')
    return
  }

  // 邮箱格式验证
  if (!validateEmail(form.email)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  // 密码强度验证
  const passwordError = validatePassword(form.password)
  if (passwordError) {
    ElMessage.error(passwordError)
    return
  }

  // 确认密码验证
  if (form.password !== form.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  isLoading.value = true

  try {
    // 调用注册 API
    const response = await axios.post('/api/auth/regist', {
      username: form.username,
      password: form.password,
      email: form.email
    })

    // 根据响应码处理结果
    if (response.data.code === 200) {
      ElMessage.success({
        message: '注册成功！即将跳转到登录页面...',
        duration: 2000,
        onClose: () => {
          router.push('/login')
        }
      })
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      ElMessage.error(response.data.message || '注册失败')
    }
  } catch (error) {
    console.error('注册错误:', error)

    // 根据错误码显示不同提示
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 400:
          ElMessage.error('请求参数错误，请检查输入')
          break
        case 409:
          ElMessage.error('用户名已存在，请更换用户名')
          break
        case 500:
          ElMessage.error('服务器内部错误，请稍后重试')
          break
        default:
          ElMessage.error(data?.message || '注册失败，请重试')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('注册失败，请重试')
    }
  } finally {
    isLoading.value = false
  }
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
  background: linear-gradient(135deg, #22c55e 0%, #0d9488 50%, #14b8a6 100%);
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

.register-container {
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

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.register-button {
  width: 100%;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 0.75rem;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.register-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #16a34a, #15803d);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.register-button:disabled {
  background: linear-gradient(135deg, #86efac, #a7f3d0);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-link {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.login-link a {
  color: #22c55e;
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
  color: #22c55e;
}

.divider {
  color: #999;
}

/* Element Plus主题定制 */
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

  .register-container {
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

  .register-container {
    padding: 2.5rem;
  }
}

/* 中等屏幕适配 (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .right-panel {
    width: 450px;
    min-width: 380px;
  }

  .register-container {
    padding: 2rem;
  }
}

/* 平板适配 (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
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

  .register-container {
    padding: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}

/* 移动端适配 (小于768px) */
@media (max-width: 767px) {
  .register-page {
    flex-direction: column;
    position: relative;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }

  .left-panel {
    min-height: 150px;
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

  .register-container {
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

  .register-button {
    padding: 0.75rem;
    font-size: 0.95rem;
  }

  .logo-text-container img {
    width: 140px;
  }

  .bottom-nav {
    font-size: 0.85rem;
  }
}

/* 小屏手机适配 (小于480px) */
@media (max-width: 480px) {
  .left-panel {
    min-height: 120px;
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

  .register-container {
    padding: 1.25rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  .register-button {
    padding: 0.7rem;
    font-size: 0.9rem;
  }

  .logo-text-container {
    margin-top: 1.5rem;
  }

  .logo-text-container img {
    width: 120px;
  }
}
</style>
