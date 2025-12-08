import { createRouter, createWebHistory } from 'vue-router'
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
    // 购物界面路由配置
    {
      path: '/shop',
      name: 'shop',
      component: ShopView
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
      component: () => import('../pages/index.vue')
    },
    // 404页面路由配置
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    },
    //购物车界面路由配置
    {
      path:'/cart',
      name:'cart',
      component: () => import('../views/CartView.vue')
    }
  ],

})

export default router
