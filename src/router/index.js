import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
// 检查组件是否正确导入
import RegisterView from '../views/RegisterView.vue'
import ShopView from '../views/ShopView.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    // 注册界面路由配置
     {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    // 网站设置页面
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    // 购物界面路由配置
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
      meta: { requiresAuth: true }
    },
    // 图书列表/搜索页面路由配置
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue'),
      meta: { requiresAuth: true }
    },
    // 登录界面路由配置
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    // 后台管理界面路由配置
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/dashboard/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // 用户管理页面
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/dashboard/UserManage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // 图书管理页面
    {
      path: '/admin/books',
      name: 'admin-books',
      component: () => import('../views/dashboard/BookManage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // 订单管理页面
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../views/dashboard/OrderManage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // 系统设置页面
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('../views/dashboard/SystemSettings.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // 用户订单页面
    {
      path: '/user/orders',
      name: 'user-orders',
      component: () => import('../views/UserOrderView.vue'),
      meta: { requiresAuth: true }
    },
    // 用户个人设置页面
    {
      path: '/user/profile',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true }
    },
    // 用户收藏页面
    {
      path: '/user/favorite',
      name: 'user-favorite',
      component: () => import('../views/UserFavoriteView.vue'),
      meta: { requiresAuth: true }
    },
    // AI 客服聊天页面
    {
      path: '/ai-chat',
      name: 'ai-chat',
      component: () => import('../views/AIChatView.vue'),
      meta: { requiresAuth: true }
    },
    // 404页面路由配置
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ],
})

// 路由守卫 - 鉴权
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // 需要登录的页面
  if (to.meta.requiresAuth) {
    if (!token) {
      ElMessage.warning('请先登录')
      next('/login')
      return
    }
  }

  // 需要管理员权限的页面
  if (to.meta.requiresAdmin) {
    if (role !== 'admin') {
      ElMessage.error('没有管理员权限')
      next('/shop')
      return
    }
  }

  // 已登录用户访问登录页，重定向
  if (to.path === '/login' && token) {
    if (role === 'admin') {
      next('/admin/dashboard')
    } else {
      next('/shop')
    }
    return
  }

  next()
})

export default router
