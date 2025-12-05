<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p class="error-message">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <div class="button-group">
        <button class="btn btn-primary" @click="goHome">
          返回首页
        </button>
        <button class="btn btn-secondary" @click="goBack">
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 1rem;
}

.not-found-container {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.error-code {
  font-size: 5rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 1rem;
  line-height: 1;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

/* 响应式布局 */
@media (min-width: 640px) {
  .button-group {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .not-found-container {
    padding: 1.5rem;
  }

  .error-code {
    font-size: 4rem;
  }

  h1 {
    font-size: 1.3rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
