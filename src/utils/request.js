import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器 - 自动携带 token
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（已包含 "Bearer " 前缀）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 如果返回的 code 不是 200，说明有错误
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')

      // 401 未授权，跳转登录页
      if (res.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('isLoggedIn')
        router.push('/login')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  (error) => {
    console.error('请求错误:', error)

    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          localStorage.removeItem('isLoggedIn')
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求失败')
    }

    return Promise.reject(error)
  }
)

export default request
