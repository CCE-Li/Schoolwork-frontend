<script setup>
import { RouterView } from 'vue-router'
import '@/assets/iconfont/iconfont.css'
</script>


<template>
  <RouterView />
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
</style>
