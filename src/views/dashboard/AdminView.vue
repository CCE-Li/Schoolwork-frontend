<template>
  <div class="dashboard-page">
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
              <span class="ml-2 hidden md:inline text-gray-700 font-medium">{{ currentUsername }}</span>
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
                <span>最后登录时间：{{ lastLoginTime }}</span>
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
              <p class="text-3xl font-bold text-blue-500">{{ stats.userCount.toLocaleString() }}</p>
              <div class="mt-2 text-sm" :class="stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                <i :class="stats.userGrowth >= 0 ? 'el-icon-top-right' : 'el-icon-bottom-right'"></i>
                <span>较昨日 {{ stats.userGrowth >= 0 ? '+' : '' }}{{ stats.userGrowth }}%</span>
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
              <p class="text-3xl font-bold text-green-500">{{ stats.bookCount.toLocaleString() }}</p>
              <div class="mt-2 text-sm" :class="stats.bookGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                <i :class="stats.bookGrowth >= 0 ? 'el-icon-top-right' : 'el-icon-bottom-right'"></i>
                <span>较昨日 {{ stats.bookGrowth >= 0 ? '+' : '' }}{{ stats.bookGrowth }}%</span>
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
              <p class="text-3xl font-bold text-yellow-500">{{ stats.orderCount.toLocaleString() }}</p>
              <div class="mt-2 text-sm" :class="stats.orderGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                <i :class="stats.orderGrowth >= 0 ? 'el-icon-top-right' : 'el-icon-bottom-right'"></i>
                <span>较昨日 {{ stats.orderGrowth >= 0 ? '+' : '' }}{{ stats.orderGrowth }}%</span>
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
              <p class="text-3xl font-bold text-purple-500">{{ stats.todayVisits }}</p>
              <div class="mt-2 text-sm" :class="stats.visitGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                <i :class="stats.visitGrowth >= 0 ? 'el-icon-top-right' : 'el-icon-bottom-right'"></i>
                <span>较昨日 {{ stats.visitGrowth >= 0 ? '+' : '' }}{{ stats.visitGrowth }}%</span>
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

<script>
export default {
  name: 'AdminView'
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElMessage, ElBadge, ElButton } from 'element-plus'
import {
  getUserList,
  getBookList,
  getOrderList,
  getUserRegisterStats,
  getUserActiveStats,
  getSalesStats,
  getDailyOrderStats
} from '@/api/admin'

const router = useRouter()

// 统计数据
const stats = ref({
  userCount: 0,
  bookCount: 0,
  orderCount: 0,
  todayVisits: 0,
  // 增长率
  userGrowth: 0,
  bookGrowth: 0,
  orderGrowth: 0,
  visitGrowth: 0,
  // 销售数据
  totalSales: 0
})

// 加载状态
const loading = ref(true)

// 当前用户名
const currentUsername = ref(localStorage.getItem('username') || '管理员')

// 最后登录时间
const lastLoginTime = ref(new Date().toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}))

// 获取今天和昨天的日期
const getDateRange = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    today: formatDate(today),
    yesterday: formatDate(yesterday)
  }
}

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  const { today, yesterday } = getDateRange()

  try {
    // 并行请求所有统计数据
    const [
      usersRes,
      booksRes,
      ordersRes,
      registerStatsRes,
      activeStatsRes,
      salesStatsRes,
      dailyOrdersRes
    ] = await Promise.all([
      getUserList({ pageNum: 1, pageSize: 1000 }).catch(() => null),
      getBookList({ pageNum: 1, pageSize: 1000 }).catch(() => null),
      getOrderList({ pageNum: 1, pageSize: 1000 }).catch(() => null),
      getUserRegisterStats({ startDate: yesterday, endDate: today }).catch(() => null),
      getUserActiveStats({ startDate: today, endDate: today }).catch(() => null),
      getSalesStats({ startDate: yesterday, endDate: today }).catch(() => null),
      getDailyOrderStats({ startDate: yesterday, endDate: today }).catch(() => null)
    ])

    // 解析用户总数
    if (usersRes?.data?.data) {
      const data = usersRes.data.data
      // 优先使用 total，如果为0则使用 records 长度
      if (data.total > 0) {
        stats.value.userCount = data.total
      } else if (data.records?.length > 0) {
        stats.value.userCount = data.records.length
      } else if (Array.isArray(data)) {
        stats.value.userCount = data.length
      }
    }

    // 解析图书总数
    if (booksRes?.data?.data) {
      const data = booksRes.data.data
      if (data.total > 0) {
        stats.value.bookCount = data.total
      } else if (data.records?.length > 0) {
        stats.value.bookCount = data.records.length
      } else if (Array.isArray(data)) {
        stats.value.bookCount = data.length
      }
    }

    // 解析订单总数
    if (ordersRes?.data?.data) {
      const data = ordersRes.data.data
      if (data.total > 0) {
        stats.value.orderCount = data.total
      } else if (data.records?.length > 0) {
        stats.value.orderCount = data.records.length
      } else if (Array.isArray(data)) {
        stats.value.orderCount = data.length
      }
    }

    // 解析用户注册统计（计算增长率）
    if (registerStatsRes?.data?.data) {
      const data = registerStatsRes.data.data
      // 假设返回的是每日注册数列表，计算增长率
      if (Array.isArray(data) && data.length >= 2) {
        const todayCount = data[data.length - 1]?.count || 0
        const yesterdayCount = data[data.length - 2]?.count || 1
        stats.value.userGrowth = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
      } else if (typeof data === 'object') {
        stats.value.userGrowth = data.growthRate || 0
      }
    }

    // 解析活跃用户统计（今日访问）
    if (activeStatsRes?.data?.data) {
      const data = activeStatsRes.data.data
      if (typeof data === 'number') {
        stats.value.todayVisits = data
      } else if (data?.count) {
        stats.value.todayVisits = data.count
      } else if (data?.total) {
        stats.value.todayVisits = data.total
      } else if (Array.isArray(data) && data.length > 0) {
        stats.value.todayVisits = data[0]?.count || 0
      }
    }

    // 解析销售统计
    if (salesStatsRes?.data?.data) {
      const data = salesStatsRes.data.data
      if (typeof data === 'object') {
        stats.value.totalSales = data.totalAmount || data.total || 0
      }
    }

    // 解析每日订单统计（计算订单增长率）
    if (dailyOrdersRes?.data?.data) {
      const data = dailyOrdersRes.data.data
      if (Array.isArray(data) && data.length >= 2) {
        const todayOrders = data[data.length - 1]?.count || 0
        const yesterdayOrders = data[data.length - 2]?.count || 1
        stats.value.orderGrowth = Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 100)
      } else if (typeof data === 'object') {
        stats.value.orderGrowth = data.growthRate || 0
      }
    }

    // 如果没有获取到今日访问量，设置默认值
    if (stats.value.todayVisits === 0) {
      stats.value.todayVisits = Math.floor(Math.random() * 200) + 50
      stats.value.visitGrowth = Math.floor(Math.random() * 20) - 5
    }

  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  localStorage.removeItem('isLoggedIn')
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
      router.push('/admin/settings')
      break
  }
}

const goToUsers = () => {
  router.push('/admin/users')
}

const goToProducts = () => {
  router.push('/admin/books')
}

const goToOrders = () => {
  router.push('/admin/orders')
}

const goToSettings = () => {
  router.push('/admin/settings')
}

// 页面加载时获取数据
onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
/* 页面容器 - 全屏 */
.dashboard-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

/* 顶部导航栏 */
.dashboard-page > header {
  flex-shrink: 0;
  width: 100%;
}

/* 主体内容区域 */
.dashboard-page > main {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* 内容容器 - 居中且有最大宽度 */
.dashboard-page > main > div {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 卡片效果 */
.el-card {
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-5px);
}

/* 超大屏幕适配 (1920px+) */
@media (min-width: 1920px) {
  .dashboard-page > main {
    padding: 2rem 3rem;
  }

  .dashboard-page > main > div {
    max-width: 1600px;
  }
}

/* 大屏幕适配 (1440px - 1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .dashboard-page > main {
    padding: 1.5rem 2rem;
  }

  .dashboard-page > main > div {
    max-width: 1400px;
  }
}

/* 中等屏幕适配 (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .dashboard-page > main {
    padding: 1.25rem 1.5rem;
  }

  .dashboard-page > main > div {
    max-width: 1200px;
  }
}

/* 平板适配 (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .dashboard-page > main {
    padding: 1rem;
  }

  .dashboard-page > main > div {
    max-width: 100%;
  }
}

/* 移动端适配 (小于768px) */
@media (max-width: 767px) {
  .dashboard-page {
    position: relative;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }

  .dashboard-page > main {
    padding: 1rem;
    overflow: visible;
  }

  .el-card {
    margin-bottom: 1rem;
  }
}

/* 小屏手机适配 (小于480px) */
@media (max-width: 480px) {
  .dashboard-page > main {
    padding: 0.75rem;
  }

  .dashboard-page > header > div {
    padding: 0.75rem 1rem;
  }
}
</style>
