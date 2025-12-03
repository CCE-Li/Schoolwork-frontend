<template>
  <div class="h-screen w-screen flex flex-col md:flex-row">
    <!-- 左侧装饰区域 -->
    <div class="hidden md:flex md:w-2/5 bg-gradient-to-br from-green-500 to-teal-700">
      <div class="h-full flex items-center justify-center p-8">
        <div class="text-white text-center">
          <h1 class="text-4xl font-bold mb-4">加入我们</h1>
          <p class="text-xl">成为易购图书商城的一员</p>
        </div>
      </div>
    </div>
    
    <!-- 右侧注册表单 -->
    <div class="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">用户注册</h2>
          
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label for="username" class="block text-gray-700 font-medium mb-2">用户名:</label>
              <el-input 
                id="username" 
                v-model="form.username" 
                type="text" 
                placeholder="请输入用户名"
                size="large"
                clearable
              />
            </div>
            
            <div class="mb-4">
              <label for="email" class="block text-gray-700 font-medium mb-2">邮箱:</label>
              <el-input 
                id="email" 
                v-model="form.email" 
                type="email" 
                placeholder="请输入邮箱地址"
                size="large"
                clearable
              />
            </div>
            
            <div class="mb-4">
              <label for="password" class="block text-gray-700 font-medium mb-2">密码:</label>
              <el-input 
                id="password" 
                v-model="form.password" 
                type="password" 
                placeholder="请输入密码"
                size="large"
                show-password
              />
            </div>
            
            <div class="mb-6">
              <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">确认密码:</label>
              <el-input 
                id="confirmPassword" 
                v-model="form.confirmPassword" 
                type="password" 
                placeholder="请再次输入密码"
                size="large"
                show-password
              />
            </div>
            
            <el-button 
              type="primary" 
              native-type="submit" 
              class="w-full"
              size="large"
            >
              注册
            </el-button>
          </form>
          
          <div class="mt-6 text-center">
            <span class="text-gray-600">已有账户？</span>
            <el-button type="text" @click="goToLogin">立即登录</el-button>
          </div>
        </div>
        
        <!-- 底部导航 -->
        <div class="mt-8 text-center">
          <img alt="易购图书商城" src="@/assets/yigou.png" class="mx-auto mb-4 w-40" />
          <nav class="flex justify-center space-x-4 text-sm text-gray-600">
            <a href="#" class="hover:text-blue-500">帮助</a>
            <span>|</span>
            <a href="#" class="hover:text-blue-500">关于我们</a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElButton } from 'element-plus'

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
    alert('两次输入的密码不一致')
    return
  }
  
  // 模拟注册成功
  console.log('注册信息:', {
    username: form.username,
    email: form.email
  })
  
  alert('注册成功！')
  // 注册成功后跳转到登录界面
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
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