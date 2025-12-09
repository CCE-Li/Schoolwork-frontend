import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// 引入图标字体
import './assets/iconfont/iconfont.css'

const app = createApp(App)

// 初始化站点主题/布局配置（刷新后也能保持暗色等设置）
const initSiteSettings = () => {
  const SETTINGS_KEY = 'siteSettings'
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (!saved) return

    const parsed = JSON.parse(saved)
    const theme = parsed.theme || {}
    const layout = parsed.layout || {}
    const modules = (parsed.modules || {})

    const root = document.documentElement

    if (theme.mode) {
      root.dataset.themeMode = theme.mode
    }
    if (theme.primaryColor) {
      root.style.setProperty('--primary-color', theme.primaryColor)
      root.style.setProperty('--el-color-primary', theme.primaryColor)
    }

    if (theme.fontSize === 'large') {
      root.style.setProperty('--base-font-size', '16px')
    } else if (theme.fontSize === 'normal') {
      root.style.setProperty('--base-font-size', '14px')
    }

    if (layout.width) {
      root.dataset.layoutWidth = layout.width
    }

    if (typeof modules.showRecommend === 'boolean') {
      root.dataset.showRecommend = modules.showRecommend ? '1' : '0'
    }
  } catch (e) {
    console.error('初始化站点设置失败:', e)
  }
}

initSiteSettings()

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
import 'virtual:windi.css'
app.mount('#app')
