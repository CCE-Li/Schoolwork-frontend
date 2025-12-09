<template>
  <div class="settings-page">
    <div class="settings-container">
      <h2 class="page-title">网站设置</h2>

      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="card">
            <template #header>
              <span>主题外观</span>
            </template>
            <el-form label-width="90px" class="settings-form">
              <el-form-item label="主题模式">
                <el-radio-group v-model="theme.mode" @change="applySettings">
                  <el-radio-button label="light">浅色</el-radio-button>
                  <el-radio-button label="dark">深色</el-radio-button>
                  <el-radio-button label="system">跟随系统</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="主色调">
                <el-select v-model="theme.primaryColor" placeholder="请选择主色" @change="applySettings" style="width: 220px">
                  <el-option label="橙色（默认）" value="#f56c6c" />
                  <el-option label="蓝色" value="#409eff" />
                  <el-option label="绿色" value="#67c23a" />
                  <el-option label="紫色" value="#9b59b6" />
                </el-select>
              </el-form-item>

              <el-form-item label="字体大小">
                <el-radio-group v-model="theme.fontSize" @change="applySettings">
                  <el-radio-button label="normal">标准</el-radio-button>
                  <el-radio-button label="large">大号</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="card">
            <template #header>
              <span>布局与模块</span>
            </template>
            <el-form label-width="110px" class="settings-form">
              <el-form-item label="页面宽度">
                <el-radio-group v-model="layout.width" @change="applySettings">
                  <el-radio-button label="normal">标准</el-radio-button>
                  <el-radio-button label="wide">更宽</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="展示模块">
                <el-checkbox v-model="modules.showRecommend" @change="applySettings">
                  显示首页“好物推荐”
                </el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveSettings">保存设置</el-button>
                <el-button @click="resetSettings">恢复默认</el-button>
                <el-button type="text" @click="backToShop">返回商城</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const defaultTheme = {
  mode: 'light',
  primaryColor: '#f56c6c',
  fontSize: 'normal'
}

const defaultLayout = {
  width: 'normal'
}

const defaultModules = {
  showRecommend: true
}

const theme = reactive({ ...defaultTheme })
const layout = reactive({ ...defaultLayout })
const modules = reactive({ ...defaultModules })

const SETTINGS_KEY = 'siteSettings'

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(theme, defaultTheme, parsed.theme || {})
      Object.assign(layout, defaultLayout, parsed.layout || {})
      Object.assign(modules, defaultModules, parsed.modules || {})
    }
  } catch (e) {
    console.error('加载设置失败:', e)
  }
}

const applySettings = () => {
  const root = document.documentElement

  root.dataset.themeMode = theme.mode
  root.style.setProperty('--primary-color', theme.primaryColor)
  root.style.setProperty('--el-color-primary', theme.primaryColor)

  if (theme.fontSize === 'large') {
    root.style.setProperty('--base-font-size', '16px')
  } else {
    root.style.setProperty('--base-font-size', '14px')
  }

  root.dataset.layoutWidth = layout.width
  root.dataset.showRecommend = modules.showRecommend ? '1' : '0'
}

const saveSettings = () => {
  const payload = {
    theme: { ...theme },
    layout: { ...layout },
    modules: { ...modules }
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
  applySettings()
  ElMessage.success('设置已保存')
}

const resetSettings = () => {
  Object.assign(theme, defaultTheme)
  Object.assign(layout, defaultLayout)
  Object.assign(modules, defaultModules)
  saveSettings()
  ElMessage.success('已恢复默认设置')
}

const backToShop = () => {
  router.push('/shop')
}

onMounted(() => {
  loadSettings()
  applySettings()
})
</script>

<style scoped>
.settings-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
  background: #f5f7fa;
}

.settings-container {
  width: 100%;
  max-width: 1100px;
}

.page-title {
  margin-bottom: 20px;
}

.card {
  margin-bottom: 20px;
}

.settings-form {
  padding-top: 10px;
}
</style>
