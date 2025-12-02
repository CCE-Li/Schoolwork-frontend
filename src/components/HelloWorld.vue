<!-- 修改 src/components/HelloWorld.vue -->
<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
    <!-- 添加注册链接 -->
    <div class="register-link">
      <router-link to="/register">用户注册</router-link>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

/* 添加样式 */
.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #42b983;
  font-weight: bold;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #42b983;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.register-link a:hover {
  background-color: #42b983;
  color: white;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>