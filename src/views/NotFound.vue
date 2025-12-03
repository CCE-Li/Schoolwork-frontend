<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div class="text-6xl font-bold text-blue-500 mb-4">404</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">页面未找到</h1>
      <p class="text-gray-600 mb-6">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <el-button 
          type="primary" 
          @click="goHome"
          size="large"
        >
          返回首页
        </el-button>
        <el-button 
          @click="goBack"
          size="large"
        >
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>