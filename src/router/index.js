import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// 检查组件是否正确导入
import RegisterView from '../views/RegisterView.vue'
import ShopView from '../views/ShopView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
    }
  ],

})

export default router
