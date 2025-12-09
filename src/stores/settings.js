import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const SETTINGS_KEY = 'siteSettings'

export const useSettingsStore = defineStore('settings', () => {
  const themeMode = ref('light')
  const primaryColor = ref('#f56c6c')
  const fontSize = ref('normal')
  const layoutWidth = ref('normal')
  const showRecommend = ref(true)

  const load = () => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        themeMode.value = parsed.theme?.mode || 'light'
        primaryColor.value = parsed.theme?.primaryColor || '#f56c6c'
        fontSize.value = parsed.theme?.fontSize || 'normal'
        layoutWidth.value = parsed.layout?.width || 'normal'
        showRecommend.value = parsed.modules?.showRecommend ?? true
      }
    } catch (e) {
      console.error('加载设置失败:', e)
    }
  }

  const save = () => {
    const payload = {
      theme: {
        mode: themeMode.value,
        primaryColor: primaryColor.value,
        fontSize: fontSize.value
      },
      layout: {
        width: layoutWidth.value
      },
      modules: {
        showRecommend: showRecommend.value
      }
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
  }

  watch([themeMode, primaryColor, fontSize, layoutWidth, showRecommend], save, { deep: true })

  return {
    themeMode,
    primaryColor,
    fontSize,
    layoutWidth,
    showRecommend,
    load,
    save
  }
})
