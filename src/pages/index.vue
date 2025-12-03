<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800">后台管理系统</h1>
        </div>
        <div class="flex items-center space-x-4">
          <el-dropdown @command="handleCommand">
            <el-avatar
              size="small"
              class="cursor-pointer"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <!-- 主体内容 -->
    <main class="flex-1 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto w-full">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来，管理员！</h2>
          <p class="text-gray-600">这里是后台管理系统的首页。</p>
        </div>
        
        <!-- 数据统计卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <el-card class="shadow hover:shadow-lg transition-shadow">
            <div class="text-center">
              <h3 class="text-gray-500 mb-2">用户总数</h3>
              <p class="text-3xl font-bold text-blue-500">1,234</p>
            </div>
          </el-card>
          
          <el-card class="shadow hover:shadow-lg transition-shadow">
            <div class="text-center">
              <h3 class="text-gray-500 mb-2">商品数量</h3>
              <p class="text-3xl font-bold text-green-500">567</p>
            </div>
          </el-card>
          
          <el-card class="shadow hover:shadow-lg transition-shadow">
            <div class="text-center">
              <h3 class="text-gray-500 mb-2">订单总数</h3>
              <p class="text-3xl font-bold text-yellow-500">890</p>
            </div>
          </el-card>
          
          <el-card class="shadow hover:shadow-lg transition-shadow">
            <div class="text-center">
              <h3 class="text-gray-500 mb-2">今日访问</h3>
              <p class="text-3xl font-bold text-purple-500">123</p>
            </div>
          </el-card>
        </div>
        
        <!-- 功能模块 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <el-card class="shadow cursor-pointer hover:shadow-lg transition-shadow" @click="goToUsers">
            <div class="text-center py-6">
              <i class="el-icon-user-solid text-4xl text-blue-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-2">用户管理</h3>
              <p class="text-gray-600">管理平台所有用户</p>
            </div>
          </el-card>
          
          <el-card class="shadow cursor-pointer hover:shadow-lg transition-shadow" @click="goToProducts">
            <div class="text-center py-6">
              <i class="el-icon-goods text-4xl text-green-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-2">商品管理</h3>
              <p class="text-gray-600">管理平台所有商品</p>
            </div>
          </el-card>
          
          <el-card class="shadow cursor-pointer hover:shadow-lg transition-shadow" @click="goToOrders">
            <div class="text-center py-6">
              <i class="el-icon-document text-4xl text-yellow-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-2">订单管理</h3>
              <p class="text-gray-600">查看和处理订单</p>
            </div>
          </el-card>
          
          <el-card class="shadow cursor-pointer hover:shadow-lg transition-shadow" @click="goToSettings">
            <div class="text-center py-6">
              <i class="el-icon-setting text-4xl text-purple-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-2">系统设置</h3>
              <p class="text-gray-600">配置平台参数</p>
            </div>
          </el-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElCard, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar } from 'element-plus'

const router = useRouter()

const logout = () => {
  // 退出登录，返回登录页
  router.push('/login')
}

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      logout()
      break
    case 'profile':
      alert('查看个人资料')
      break
    case 'settings':
      alert('系统设置')
      break
  }
}

const goToUsers = () => {
  alert('跳转到用户管理页面')
}

const goToProducts = () => {
  alert('跳转到商品管理页面')
}

const goToOrders = () => {
  alert('跳转到订单管理页面')
}

const goToSettings = () => {
  alert('跳转到系统设置页面')
}
</script>

<style scoped>
/* 可以在这里添加额外的样式 */
</style>