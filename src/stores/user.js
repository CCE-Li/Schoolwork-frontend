import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')
  const role = ref(localStorage.getItem('role') || 'user')
  const userId = ref(localStorage.getItem('userId') || '')

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'admin')

  // 登录
  function login(data) {
    token.value = data.token
    username.value = data.username
    role.value = data.role || 'user'
    userId.value = data.userId || ''

    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('role', data.role || 'user')
    localStorage.setItem('userId', data.userId || '')
    localStorage.setItem('isLoggedIn', 'true')
  }

  // 登出
  function logout() {
    token.value = ''
    username.value = ''
    role.value = 'user'
    userId.value = ''

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('isLoggedIn')
  }

  // 检查是否有管理员权限
  function checkAdminPermission() {
    return isAdmin.value
  }

  return {
    token,
    username,
    role,
    userId,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    checkAdminPermission
  }
})
