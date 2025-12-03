# Vue 3 使用与路由变量文档

> 项目名称: bookstore  
> 生成时间: 2024年12月  
> Vue 版本: 3.5.25  
> Vue Router 版本: 4.6.3  
> Pinia 版本: 3.0.4

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈](#2-技术栈)
3. [项目结构](#3-项目结构)
4. [Vue 3 特性使用情况](#4-vue-3-特性使用情况)
5. [路由配置详解](#5-路由配置详解)
6. [状态管理 (Pinia)](#6-状态管理-pinia)
7. [组件清单](#7-组件清单)
8. [Vue 3 API 使用汇总](#8-vue-3-api-使用汇总)

---

## 1. 项目概述

这是一个基于 Vue 3 + Vite 构建的图书商城前端项目（易购图书），包含首页展示、用户注册等功能模块。

---

## 2. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | ^3.5.25 | 前端框架 |
| Vue Router | ^4.6.3 | 路由管理 |
| Pinia | ^3.0.4 | 状态管理 |
| Vite | ^7.2.4 | 构建工具 |
| ESLint | ^9.39.1 | 代码规范 |

---

## 3. 项目结构

```
src/
├── App.vue                 # 根组件
├── main.js                 # 应用入口
├── assets/                 # 静态资源
│   └── iconfont/           # 图标字体
├── components/             # 公共组件
│   ├── HelloWorld.vue
│   ├── TheWelcome.vue
│   ├── WelcomeItem.vue
│   └── icons/              # 图标组件
│       ├── IconCommunity.vue
│       ├── IconDocumentation.vue
│       ├── IconEcosystem.vue
│       ├── IconSupport.vue
│       └── IconTooling.vue
├── router/                 # 路由配置
│   └── index.js
├── stores/                 # Pinia 状态管理
│   └── counter.js
└── views/                  # 页面视图
    ├── AboutView.vue
    ├── HomeView.vue
    └── RegisterView.vue
```

---

## 4. Vue 3 特性使用情况

### 4.1 Composition API 使用

#### `<script setup>` 语法糖

| 文件 | 使用情况 |
|------|----------|
| `App.vue` | ✅ 使用 `<script setup>` |
| `RegisterView.vue` | ✅ 使用 `<script setup>` |
| `HelloWorld.vue` | ✅ 使用 `<script setup>` |
| `TheWelcome.vue` | ✅ 使用 `<script setup>` |
| `HomeView.vue` | ❌ 使用 Options API |
| `AboutView.vue` | ❌ 无脚本 |
| `WelcomeItem.vue` | ❌ 无脚本 |

### 4.2 响应式 API 使用

| API | 使用位置 | 说明 |
|-----|----------|------|
| `ref()` | `stores/counter.js` | 定义响应式变量 `count` |
| `computed()` | `stores/counter.js` | 计算属性 `doubleCount` |
| `reactive()` | `views/RegisterView.vue` | 表单数据对象 `form` |

#### 示例代码

**`stores/counter.js` - ref 和 computed 使用:**
```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})
```

**`views/RegisterView.vue` - reactive 使用:**
```javascript
import { reactive } from 'vue'

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
```

### 4.3 defineProps 使用

| 组件 | Props 定义 |
|------|-----------|
| `HelloWorld.vue` | `msg: { type: String, required: true }` |

```javascript
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
```

---

## 5. 路由配置详解

### 5.1 路由实例创建

**文件位置:** `src/router/index.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...]
})

export default router
```

### 5.2 路由表

| 路径 | 名称 | 组件 | 加载方式 |
|------|------|------|----------|
| `/` | `home` | `HomeView` | 静态导入 |
| `/about` | `about` | `AboutView` | 懒加载 |
| `/register` | `register` | `RegisterView` | 静态导入 |

### 5.3 路由变量详解

#### 路由名称常量

```javascript
// 路由名称
const ROUTE_NAMES = {
  HOME: 'home',
  ABOUT: 'about',
  REGISTER: 'register'
}

// 路由路径
const ROUTE_PATHS = {
  HOME: '/',
  ABOUT: '/about',
  REGISTER: '/register'
}
```

#### 路由配置详情

```javascript
routes: [
  {
    path: '/',           // 首页路径
    name: 'home',        // 路由名称
    component: HomeView, // 静态导入组件
  },
  {
    path: '/about',
    name: 'about',
    // 路由级别代码分割 - 懒加载
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  }
]
```

### 5.4 路由使用方式

#### 编程式导航

**`RegisterView.vue` 中使用:**
```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 注册成功后跳转到首页
router.push('/')
```

#### 声明式导航

**`RegisterView.vue` 中使用:**
```html
<router-link to="/">返回首页</router-link>
```

**`HelloWorld.vue` 中使用:**
```html
<router-link to="/register">用户注册</router-link>
```

#### RouterView 使用

**`App.vue` 中使用:**
```html
<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
```

---

## 6. 状态管理 (Pinia)

### 6.1 Store 定义

**文件:** `src/stores/counter.js`

```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  
  // Getters
  const doubleCount = computed(() => count.value * 2)
  
  // Actions
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### 6.2 Store 变量

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `count` | `ref(0)` | 计数器状态 |
| `doubleCount` | `computed` | 计算属性，返回 count * 2 |
| `increment` | `function` | 增加计数的方法 |

### 6.3 应用初始化

**`main.js`:**
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())  // 注册 Pinia
app.use(router)         // 注册 Router

app.mount('#app')
```

---

## 7. 组件清单

### 7.1 视图组件 (Views)

| 组件 | 文件 | API 风格 | 说明 |
|------|------|----------|------|
| HomeView | `views/HomeView.vue` | Options API | 首页，包含导航、Banner、商品展示 |
| AboutView | `views/AboutView.vue` | 无脚本 | 关于页面 |
| RegisterView | `views/RegisterView.vue` | Composition API | 用户注册页面 |

### 7.2 公共组件 (Components)

| 组件 | 文件 | API 风格 | 说明 |
|------|------|----------|------|
| HelloWorld | `components/HelloWorld.vue` | Composition API | 欢迎组件，含注册链接 |
| TheWelcome | `components/TheWelcome.vue` | Composition API | 欢迎信息展示 |
| WelcomeItem | `components/WelcomeItem.vue` | 无脚本 | 欢迎项模板组件 |

### 7.3 图标组件 (Icons)

| 组件 | 文件 |
|------|------|
| IconCommunity | `components/icons/IconCommunity.vue` |
| IconDocumentation | `components/icons/IconDocumentation.vue` |
| IconEcosystem | `components/icons/IconEcosystem.vue` |
| IconSupport | `components/icons/IconSupport.vue` |
| IconTooling | `components/icons/IconTooling.vue` |

---

## 8. Vue 3 API 使用汇总

### 8.1 核心 API

| API | 来源 | 使用文件 |
|-----|------|----------|
| `createApp` | `vue` | `main.js` |
| `ref` | `vue` | `stores/counter.js` |
| `computed` | `vue` | `stores/counter.js` |
| `reactive` | `vue` | `views/RegisterView.vue` |
| `defineProps` | `vue` (编译器宏) | `components/HelloWorld.vue` |

### 8.2 Vue Router API

| API | 来源 | 使用文件 |
|-----|------|----------|
| `createRouter` | `vue-router` | `router/index.js` |
| `createWebHistory` | `vue-router` | `router/index.js` |
| `useRouter` | `vue-router` | `views/RegisterView.vue` |
| `RouterView` | `vue-router` | `App.vue` |
| `router-link` | `vue-router` | `views/RegisterView.vue`, `components/HelloWorld.vue` |

### 8.3 Pinia API

| API | 来源 | 使用文件 |
|-----|------|----------|
| `createPinia` | `pinia` | `main.js` |
| `defineStore` | `pinia` | `stores/counter.js` |

---

## 附录: 路由快速参考

```javascript
// 路由跳转方式

// 1. 编程式导航
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/')                    // 字符串路径
router.push({ name: 'home' })       // 命名路由
router.push({ path: '/register' })  // 带路径的对象

// 2. 声明式导航
<router-link to="/">首页</router-link>
<router-link :to="{ name: 'register' }">注册</router-link>

// 3. 获取当前路由信息
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.name)   // 当前路由名称
console.log(route.path)   // 当前路由路径
console.log(route.params) // 路由参数
console.log(route.query)  // 查询参数
```

---

*文档结束*
