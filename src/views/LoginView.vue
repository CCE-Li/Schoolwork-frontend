<template>
  <div class="h-screen w-screen flex flex-col md:flex-row">
    <!-- 左侧装饰区域 -->
    <div class="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-500 to-indigo-700">
      <div class="h-full flex items-center justify-center p-8">
        <div class="text-white text-center">
          <h1 class="text-4xl font-bold mb-4">欢迎来到易购图书商城</h1>
          <p class="text-xl">一站式图书购物平台</p>
        </div>
      </div>
    </div>
    
    <!-- 右侧登录表单 -->
    <div class="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">用户登录</h2>
          
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="username" class="block text-gray-700 font-medium mb-2">用户名:</label>
              <el-input 
                id="username" 
                v-model="loginForm.username" 
                type="text" 
                placeholder="请输入用户名"
                size="large"
                clearable
              />
            </div>
            
            <div class="mb-4">
              <label for="password" class="block text-gray-700 font-medium mb-2">密码:</label>
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
            <div class="mb-6">
              <label class="block text-gray-700 font-medium mb-2">登录类型:</label>
              <el-radio-group v-model="loginForm.userType" class="w-full">
                <el-radio-button label="user">用户登录</el-radio-button>
                <el-radio-button label="admin">管理员登录</el-radio-button>
              </el-radio-group>
            </div>
            
            <el-button 
              type="primary" 
              native-type="submit" 
              class="w-full"
              size="large"
            >
              登录
            </el-button>
          </form>
          
          <div class="mt-6 text-center">
            <span class="text-gray-600">还没有账户？</span>
            <el-button type="text" @click="goToRegister">立即注册</el-button>
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
  
  <!-- 自定义通知组件 -->
  <el-dialog
    v-model="showNotification"
    :show-close="false"
    width="400px"
    center
  >
    <div class="text-center py-4">
      <i class="el-icon-warning text-red-500 text-3xl mb-2"></i>
      <p class="text-lg">{{ notificationMessage }}</p>
    </div>
    <template #footer>
      <div class="text-center">
        <el-button type="primary" @click="closeNotification">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElButton, ElRadioGroup, ElRadioButton, ElDialog } from 'element-plus'

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
/* Element Plus主题定制 */
:deep(.el-radio-button__inner) {
  width: 120px;
  text-align: center;
}
</style>