<template>
  <div class="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-lg">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
            <i class="el-icon-setting text-white text-xl"></i>
          </div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">后台管理系统</h1>
        </div>
        <div class="flex items-center space-x-4">
          <el-badge :value="3" class="hidden md:block">
            <el-button type="text" class="text-gray-600 hover:text-blue-500">
              <i class="el-icon-bell text-xl"></i>
            </el-button>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <div class="flex items-center cursor-pointer">
              <el-avatar
                size="small"
                class="cursor-pointer"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="ml-2 hidden md:inline text-gray-700 font-medium">管理员</span>
              <i class="el-icon-arrow-down ml-1 text-xs text-gray-500"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <i class="el-icon-user mr-2"></i>个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <i class="el-icon-setting mr-2"></i>系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <i class="el-icon-switch-button mr-2"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <!-- 主体内容 -->
    <main class="flex-1 overflow-y-auto p-4 md:p-6 w-full">
      <div class="mx-auto w-full">
        <!-- 欢迎区域 -->
        <div class="mb-8 bg-white rounded-xl shadow-md p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来，管理员！</h2>
              <p class="text-gray-600 mb-4">这里是后台管理系统的首页，您可以在这里管理整个平台。</p>
              <div class="flex items-center text-sm text-gray-500">
                <i class="el-icon-date mr-1"></i>
                <span>最后登录时间：2025-12-04 10:30</span>
              </div>
            </div>
            <div class="mt-4 md:mt-0">
              <el-button type="primary" round>
                <i class="el-icon-plus mr-1"></i>新增内容
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 数据统计卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <el-card class="shadow hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-blue-500 cursor-pointer h-full">
            <div class="text-center">
              <div class="flex justify-center mb-3">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="el-icon-user text-blue-500 text-xl"></i>
                </div>
              </div>
              <h3 class="text-gray-500 mb-1">用户总数</h3>
              <p class="text-3xl font-bold text-blue-500">1,234</p>
              <div class="mt-2 text-sm text-green-500">
                <i class="el-icon-top-right"></i>
                <span>较昨日 +12%</span>
              </div>
            </div>
          </el-card>
          
          <el-card class="shadow hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-green-500 cursor-pointer h-full">
            <div class="text-center">
              <div class="flex justify-center mb-3">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="el-icon-goods text-green-500 text-xl"></i>
                </div>
              </div>
              <h3 class="text-gray-500 mb-1">商品数量</h3>
              <p class="text-3xl font-bold text-green-500">567</p>
              <div class="mt-2 text-sm text-green-500">
                <i class="el-icon-top-right"></i>
                <span>较昨日 +5%</span>
              </div>
            </div>
          </el-card>
          
          <el-card class="shadow hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-yellow-500 cursor-pointer h-full">
            <div class="text-center">
              <div class="flex justify-center mb-3">
                <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i class="el-icon-document text-yellow-500 text-xl"></i>
                </div>
              </div>
              <h3 class="text-gray-500 mb-1">订单总数</h3>
              <p class="text-3xl font-bold text-yellow-500">890</p>
              <div class="mt-2 text-sm text-red-500">
                <i class="el-icon-bottom-right"></i>
                <span>较昨日 -2%</span>
              </div>
            </div>
          </el-card>
          
          <el-card class="shadow hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-purple-500 cursor-pointer h-full">
            <div class="text-center">
              <div class="flex justify-center mb-3">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <i class="el-icon-view text-purple-500 text-xl"></i>
                </div>
              </div>
              <h3 class="text-gray-500 mb-1">今日访问</h3>
              <p class="text-3xl font-bold text-purple-500">123</p>
              <div class="mt-2 text-sm text-green-500">
                <i class="el-icon-top-right"></i>
                <span>较昨日 +8%</span>
              </div>
            </div>
          </el-card>
        </div>
        
        <!-- 功能模块 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <el-card class="shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 h-full" @click="goToUsers">
            <div class="text-center py-8">
              <div class="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <i class="el-icon-user-solid text-3xl text-blue-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-blue-800">用户管理</h3>
              <p class="text-blue-600">管理平台所有用户</p>
            </div>
          </el-card>
          
          <el-card class="shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 h-full" @click="goToProducts">
            <div class="text-center py-8">
              <div class="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <i class="el-icon-goods text-3xl text-green-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-green-800">商品管理</h3>
              <p class="text-green-600">管理平台所有商品</p>
            </div>
          </el-card>
          
          <el-card class="shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 h-full" @click="goToOrders">
            <div class="text-center py-8">
              <div class="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <i class="el-icon-document text-3xl text-yellow-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-yellow-800">订单管理</h3>
              <p class="text-yellow-600">查看和处理订单</p>
            </div>
          </el-card>
          
          <el-card class="shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 h-full" @click="goToSettings">
            <div class="text-center py-8">
              <div class="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <i class="el-icon-setting text-3xl text-purple-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-purple-800">系统设置</h3>
              <p class="text-purple-600">配置平台参数</p>
            </div>
          </el-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElCard, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElMessage, ElBadge, ElButton } from 'element-plus'

const router = useRouter()

const logout = () => {
  // 退出登录，返回登录页
  ElMessage.success('退出登录成功')
  router.push('/login')
}

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      logout()
      break
    case 'profile':
      ElMessage.info('正在查看个人资料...')
      break
    case 'settings':
      ElMessage.info('正在进入系统设置...')
      break
  }
}

const goToUsers = () => {
  ElMessage.success('即将跳转到用户管理页面...')
  setTimeout(() => {
    router.push('/users')
  }, 1000)
}

const goToProducts = () => {
  ElMessage.success('即将跳转到商品管理页面...')
  setTimeout(() => {
    router.push('/products')
  }, 1000)
}

const goToOrders = () => {
  ElMessage.success('即将跳转到订单管理页面...')
  setTimeout(() => {
    router.push('/orders')
  }, 1000)
}

const goToSettings = () => {
  ElMessage.success('即将跳转到系统设置页面...')
  setTimeout(() => {
    router.push('/settings')
  }, 1000)
}
</script>

<style scoped>
/* 添加一些额外的样式来增强视觉效果 */
.el-card {
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-5px);
}

/* 为欢迎区域添加渐变背景 */
.welcome-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 为数据卡片添加悬停效果 */
.stat-card:hover {
  border-left-width: 6px;
}

/* 为功能卡片添加更深的阴影效果 */
.feature-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-card {
    margin-bottom: 1rem;
  }
  
  .welcome-content {
    text-align: center;
  }
  
  .welcome-buttons {
    margin-top: 1rem;
  }
}
</style>