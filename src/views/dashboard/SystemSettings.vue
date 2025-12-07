<template>
  <div class="manage-page">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-lg">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <el-button type="text" @click="goBack" class="mr-4">
            <i class="el-icon-arrow-left text-xl"></i>
          </el-button>
          <h1 class="text-xl font-bold text-gray-800">系统设置</h1>
        </div>
        <div class="flex items-center space-x-4">
          <el-button type="primary" @click="saveAllSettings">
            <i class="el-icon-check mr-1"></i>保存所有设置
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1 overflow-y-auto p-6">
      <div class="max-w-4xl mx-auto space-y-6">

        <!-- 站点设置 -->
        <el-card class="shadow-md">
          <template #header>
            <div class="flex items-center">
              <i class="el-icon-monitor text-blue-500 mr-2"></i>
              <span class="font-bold">站点设置</span>
            </div>
          </template>
          <el-form label-width="120px" :model="siteSettings">
            <el-form-item label="站点名称">
              <el-input v-model="siteSettings.siteName" placeholder="请输入站点名称" />
            </el-form-item>
            <el-form-item label="站点Logo">
              <el-input v-model="siteSettings.logo" placeholder="请输入Logo URL">
                <template #append>
                  <el-button>上传</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="站点描述">
              <el-input
                v-model="siteSettings.description"
                type="textarea"
                :rows="3"
                placeholder="请输入站点描述"
              />
            </el-form-item>
            <el-form-item label="备案号">
              <el-input v-model="siteSettings.icp" placeholder="请输入ICP备案号" />
            </el-form-item>
            <el-form-item label="站点状态">
              <el-switch
                v-model="siteSettings.isOpen"
                active-text="开放"
                inactive-text="维护中"
              />
            </el-form-item>
            <el-form-item label="维护提示" v-if="!siteSettings.isOpen">
              <el-input
                v-model="siteSettings.maintenanceMsg"
                type="textarea"
                placeholder="站点维护时显示的提示信息"
              />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 安全设置 -->
        <el-card class="shadow-md">
          <template #header>
            <div class="flex items-center">
              <i class="el-icon-lock text-green-500 mr-2"></i>
              <span class="font-bold">安全设置</span>
            </div>
          </template>
          <el-form label-width="120px" :model="securitySettings">
            <el-form-item label="登录验证码">
              <el-switch v-model="securitySettings.enableCaptcha" />
              <span class="text-gray-500 text-sm ml-2">开启后登录需要输入验证码</span>
            </el-form-item>
            <el-form-item label="密码最小长度">
              <el-input-number
                v-model="securitySettings.minPasswordLength"
                :min="6"
                :max="20"
              />
              <span class="text-gray-500 text-sm ml-2">位</span>
            </el-form-item>
            <el-form-item label="登录失败限制">
              <el-input-number
                v-model="securitySettings.maxLoginAttempts"
                :min="3"
                :max="10"
              />
              <span class="text-gray-500 text-sm ml-2">次后锁定账号</span>
            </el-form-item>
            <el-form-item label="锁定时长">
              <el-input-number
                v-model="securitySettings.lockDuration"
                :min="5"
                :max="60"
              />
              <span class="text-gray-500 text-sm ml-2">分钟</span>
            </el-form-item>
            <el-form-item label="Token有效期">
              <el-input-number
                v-model="securitySettings.tokenExpiry"
                :min="1"
                :max="168"
              />
              <span class="text-gray-500 text-sm ml-2">小时</span>
            </el-form-item>
            <el-form-item label="允许多端登录">
              <el-switch v-model="securitySettings.allowMultiLogin" />
              <span class="text-gray-500 text-sm ml-2">关闭后同一账号只能在一个设备登录</span>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 邮件设置 -->
        <el-card class="shadow-md">
          <template #header>
            <div class="flex items-center">
              <i class="el-icon-message text-orange-500 mr-2"></i>
              <span class="font-bold">邮件设置</span>
            </div>
          </template>
          <el-form label-width="120px" :model="emailSettings">
            <el-form-item label="启用邮件">
              <el-switch v-model="emailSettings.enabled" />
            </el-form-item>
            <template v-if="emailSettings.enabled">
              <el-form-item label="SMTP服务器">
                <el-input v-model="emailSettings.smtpHost" placeholder="如: smtp.qq.com" />
              </el-form-item>
              <el-form-item label="SMTP端口">
                <el-input-number v-model="emailSettings.smtpPort" :min="1" :max="65535" />
              </el-form-item>
              <el-form-item label="发件人邮箱">
                <el-input v-model="emailSettings.senderEmail" placeholder="请输入发件人邮箱" />
              </el-form-item>
              <el-form-item label="邮箱密码">
                <el-input
                  v-model="emailSettings.senderPassword"
                  type="password"
                  placeholder="请输入邮箱密码或授权码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="发件人名称">
                <el-input v-model="emailSettings.senderName" placeholder="请输入发件人显示名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testEmail">发送测试邮件</el-button>
              </el-form-item>
            </template>
          </el-form>
        </el-card>

        <!-- 订单设置 -->
        <el-card class="shadow-md">
          <template #header>
            <div class="flex items-center">
              <i class="el-icon-document text-purple-500 mr-2"></i>
              <span class="font-bold">订单设置</span>
            </div>
          </template>
          <el-form label-width="120px" :model="orderSettings">
            <el-form-item label="订单超时">
              <el-input-number
                v-model="orderSettings.orderTimeout"
                :min="5"
                :max="120"
              />
              <span class="text-gray-500 text-sm ml-2">分钟未支付自动取消</span>
            </el-form-item>
            <el-form-item label="自动确认收货">
              <el-input-number
                v-model="orderSettings.autoConfirmDays"
                :min="7"
                :max="30"
              />
              <span class="text-gray-500 text-sm ml-2">天后自动确认收货</span>
            </el-form-item>
            <el-form-item label="允许退款">
              <el-switch v-model="orderSettings.allowRefund" />
            </el-form-item>
            <el-form-item label="退款期限" v-if="orderSettings.allowRefund">
              <el-input-number
                v-model="orderSettings.refundDays"
                :min="1"
                :max="30"
              />
              <span class="text-gray-500 text-sm ml-2">天内可申请退款</span>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 存储设置 -->
        <el-card class="shadow-md">
          <template #header>
            <div class="flex items-center">
              <i class="el-icon-folder text-yellow-500 mr-2"></i>
              <span class="font-bold">存储设置</span>
            </div>
          </template>
          <el-form label-width="120px" :model="storageSettings">
            <el-form-item label="存储方式">
              <el-radio-group v-model="storageSettings.type">
                <el-radio label="local">本地存储</el-radio>
                <el-radio label="oss">阿里云OSS</el-radio>
                <el-radio label="cos">腾讯云COS</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="storageSettings.type !== 'local'">
              <el-form-item label="AccessKey">
                <el-input v-model="storageSettings.accessKey" placeholder="请输入AccessKey" />
              </el-form-item>
              <el-form-item label="SecretKey">
                <el-input
                  v-model="storageSettings.secretKey"
                  type="password"
                  placeholder="请输入SecretKey"
                  show-password
                />
              </el-form-item>
              <el-form-item label="Bucket">
                <el-input v-model="storageSettings.bucket" placeholder="请输入Bucket名称" />
              </el-form-item>
              <el-form-item label="Region">
                <el-input v-model="storageSettings.region" placeholder="如: oss-cn-hangzhou" />
              </el-form-item>
              <el-form-item label="访问域名">
                <el-input v-model="storageSettings.domain" placeholder="请输入CDN或访问域名" />
              </el-form-item>
            </template>
            <el-form-item label="上传大小限制">
              <el-input-number
                v-model="storageSettings.maxSize"
                :min="1"
                :max="100"
              />
              <span class="text-gray-500 text-sm ml-2">MB</span>
            </el-form-item>
            <el-form-item label="允许的文件类型">
              <el-input
                v-model="storageSettings.allowedTypes"
                placeholder="如: jpg,png,gif,pdf"
              />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 缓存管理 -->
        <el-card class="shadow-md">
          <template #header>
            <div class="flex items-center">
              <i class="el-icon-refresh text-red-500 mr-2"></i>
              <span class="font-bold">缓存管理</span>
            </div>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium">页面缓存</div>
                <div class="text-sm text-gray-500">清除所有页面静态缓存</div>
              </div>
              <el-button type="danger" @click="clearCache('page')">清除</el-button>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium">数据缓存</div>
                <div class="text-sm text-gray-500">清除数据库查询缓存</div>
              </div>
              <el-button type="danger" @click="clearCache('data')">清除</el-button>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium">全部缓存</div>
                <div class="text-sm text-gray-500">清除所有系统缓存</div>
              </div>
              <el-button type="danger" @click="clearCache('all')">全部清除</el-button>
            </div>
          </div>
        </el-card>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 站点设置
const siteSettings = ref({
  siteName: '易购书城',
  logo: '/logo.png',
  description: '专业的在线图书购物平台',
  icp: '京ICP备12345678号',
  isOpen: true,
  maintenanceMsg: '系统维护中，请稍后访问...'
})

// 安全设置
const securitySettings = ref({
  enableCaptcha: false,
  minPasswordLength: 8,
  maxLoginAttempts: 5,
  lockDuration: 30,
  tokenExpiry: 24,
  allowMultiLogin: true
})

// 邮件设置
const emailSettings = ref({
  enabled: false,
  smtpHost: '',
  smtpPort: 465,
  senderEmail: '',
  senderPassword: '',
  senderName: '易购书城'
})

// 订单设置
const orderSettings = ref({
  orderTimeout: 30,
  autoConfirmDays: 15,
  allowRefund: true,
  refundDays: 7
})

// 存储设置
const storageSettings = ref({
  type: 'local',
  accessKey: '',
  secretKey: '',
  bucket: '',
  region: '',
  domain: '',
  maxSize: 10,
  allowedTypes: 'jpg,jpeg,png,gif,webp,pdf'
})

// 保存所有设置
const saveAllSettings = async () => {
  try {
    // 这里可以调用后端API保存设置
    // await saveSettings({
    //   site: siteSettings.value,
    //   security: securitySettings.value,
    //   email: emailSettings.value,
    //   order: orderSettings.value,
    //   storage: storageSettings.value
    // })

    // 模拟保存
    ElMessage.success('设置保存成功')

    // 保存到 localStorage 作为演示
    localStorage.setItem('systemSettings', JSON.stringify({
      site: siteSettings.value,
      security: securitySettings.value,
      email: emailSettings.value,
      order: orderSettings.value,
      storage: storageSettings.value
    }))
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败')
  }
}

// 发送测试邮件
const testEmail = async () => {
  if (!emailSettings.value.smtpHost || !emailSettings.value.senderEmail) {
    ElMessage.warning('请先完善邮件配置')
    return
  }

  try {
    // 这里调用后端API发送测试邮件
    ElMessage.success('测试邮件已发送，请检查收件箱')
  } catch {
    ElMessage.error('发送测试邮件失败')
  }
}

// 清除缓存
const clearCache = async (type) => {
  const typeMap = {
    page: '页面缓存',
    data: '数据缓存',
    all: '全部缓存'
  }

  try {
    await ElMessageBox.confirm(
      `确定要清除${typeMap[type]}吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 这里调用后端API清除缓存
    ElMessage.success(`${typeMap[type]}已清除`)
  } catch {
    // 用户取消
  }
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('systemSettings')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      if (settings.site) siteSettings.value = settings.site
      if (settings.security) securitySettings.value = settings.security
      if (settings.email) emailSettings.value = settings.email
      if (settings.order) orderSettings.value = settings.order
      if (settings.storage) storageSettings.value = settings.storage
    } catch {
      console.error('加载设置失败')
    }
  }
}

// 返回上一页
const goBack = () => {
  router.push('/admin/dashboard')
}

// 初始化加载设置
loadSettings()
</script>

<style scoped>
.manage-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.manage-page > header {
  flex-shrink: 0;
  width: 100%;
}

.manage-page > main {
  flex: 1;
  overflow-y: auto;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
