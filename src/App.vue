<script setup>
import { RouterView } from 'vue-router'
import '@/assets/iconfont/iconfont.css'
</script>


<template>
  <transition name="fade-slide" mode="out-in">
    <RouterView />
  </transition>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
}

/* 全局路由切换过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.38s cubic-bezier(0.22, 0.8, 0.3, 1),
              transform 0.38s cubic-bezier(0.22, 0.8, 0.3, 1),
              box-shadow 0.38s cubic-bezier(0.22, 0.8, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.985);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}
</style>
