<template>
  <div class="settings-page">
    <div class="settings-container">
      <h2 class="page-title">设置</h2>
      
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 个性化设置 -->
        <el-tab-pane label="个性化" name="personalization">
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>主题设置</span>
            </template>
            <div class="setting-item">
              <div class="setting-label">
                <i class="el-icon-moon"></i>
                <span>深色模式</span>
              </div>
              <el-switch 
                v-model="darkMode" 
                active-text="开启" 
                inactive-text="关闭"
                @change="toggleDarkMode"
              />
            </div>
            <div class="setting-description">
              开启深色模式以减少眼部疲劳，特别是在低光环境下。
            </div>
          </el-card>
        </el-tab-pane>
        
        <!-- 个人资料 -->
        <el-tab-pane label="个人资料" name="profile">
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>基本信息</span>
            </template>
            <el-form :model="profileForm" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="profileForm.phone" placeholder="请输入联系电话" />
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="profileForm.address" placeholder="请输入收货地址" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveProfile">保存信息</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
        
        <!-- 账户安全 -->
        <el-tab-pane label="账户安全" name="security">
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>密码设置</span>
            </template>
            <el-form :model="passwordForm" label-width="100px">
              <el-form-item label="原密码">
                <el-input 
                  v-model="passwordForm.oldPassword" 
                  type="password" 
                  show-password 
                  placeholder="请输入原密码" 
                />
              </el-form-item>
              <el-form-item label="新密码">
                <el-input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  show-password 
                  placeholder="请输入新密码" 
                />
              </el-form-item>
              <el-form-item label="确认新密码">
                <el-input 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  show-password 
                  placeholder="请再次输入新密码" 
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changePassword">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>注销账号</span>
            </template>
            <div class="danger-zone">
              <p>注销账号将会永久删除您的所有信息，包括但不限于：</p>
              <ul>
                <li>个人基本资料</li>
                <li>购买记录和订单历史</li>
                <li>收藏夹和心愿单</li>
                <li>积分和优惠券</li>
              </ul>
              <el-button 
                type="danger" 
                plain 
                @click="showDeleteAccountDialog"
              >
                注销账号
              </el-button>
            </div>
          </el-card>
        </el-tab-pane>
        
        <!-- 隐私设置 -->
        <el-tab-pane label="隐私" name="privacy">
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>个人信息与权限</span>
            </template>
            <div class="setting-item">
              <div class="setting-label">
                <i class="el-icon-user"></i>
                <span>个人信息收集</span>
              </div>
              <el-switch v-model="privacySettings.collectInfo" />
            </div>
            <div class="setting-description">
              控制是否允许我们收集您的个人信息用于改进服务体验。
            </div>
            
            <div class="setting-item">
              <div class="setting-label">
                <i class="el-icon-location"></i>
                <span>位置信息</span>
              </div>
              <el-switch v-model="privacySettings.locationAccess" />
            </div>
            <div class="setting-description">
              控制应用是否可以访问您的位置信息用于配送服务。
            </div>
            
            <div class="setting-item">
              <div class="setting-label">
                <i class="el-icon-chat-dot-round"></i>
                <span>个性化推荐</span>
              </div>
              <el-switch v-model="privacySettings.personalizedRecommendation" />
            </div>
            <div class="setting-description">
              根据您的浏览和购买记录为您提供个性化图书推荐。
            </div>
          </el-card>
          
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>个人信息收集清单</span>
            </template>
            <el-table :data="collectedData" style="width: 100%" border>
              <el-table-column prop="type" label="信息类型" width="180" />
              <el-table-column prop="content" label="具体内容" />
              <el-table-column prop="purpose" label="用途说明" />
            </el-table>
            
            <div class="policy-link">
              <el-button type="primary" link @click="goToAfterSalesPolicy">查看售后政策</el-button>
            </div>
          </el-card>
          
          <el-card shadow="hover" class="setting-card">
            <template #header>
              <span>帮助与反馈</span>
            </template>
            <div class="feedback-section">
              <el-form :model="feedbackForm" label-width="80px">
                <el-form-item label="问题类型">
                  <el-select v-model="feedbackForm.type" placeholder="请选择问题类型">
                    <el-option label="功能建议" value="suggestion" />
                    <el-option label="Bug反馈" value="bug" />
                    <el-option label="使用咨询" value="question" />
                    <el-option label="投诉举报" value="complaint" />
                  </el-select>
                </el-form-item>
                <el-form-item label="详细描述">
                  <el-input
                    v-model="feedbackForm.content"
                    type="textarea"
                    :rows="4"
                    placeholder="请详细描述您遇到的问题或建议"
                  />
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input
                    v-model="feedbackForm.contact"
                    placeholder="请输入您的联系方式，方便我们回复您"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      
      <el-card shadow="never" class="setting-card footer-card">
        <div class="footer-actions">
          <el-button @click="logout" type="danger" plain>
            <i class="el-icon-switch-button"></i>退出登录
          </el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 注销账号确认对话框 -->
    <el-dialog
      v-model="deleteAccountDialogVisible"
      title="注销账号确认"
      width="500px"
      :before-close="handleClose"
    >
      <div class="delete-account-warning">
        <el-alert
          title="重要提醒"
          type="error"
          description="您即将注销账号，此操作不可逆，请慎重考虑。"
          show-icon
        />
        <p class="confirmation-text">请输入您的用户名 "<strong>{{ username }}</strong>" 来确认注销：</p>
        <el-input v-model="confirmUsername" placeholder="请输入用户名确认" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteAccountDialogVisible = false">取 消</el-button>
          <el-button 
            type="danger" 
            @click="deleteAccount"
            :disabled="confirmUsername !== username"
          >
            确 认 注 销
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 跳转到售后政策页面
const goToAfterSalesPolicy = () => {
  router.push('/policy/after-sales')
}

const activeTab = ref('personalization')
const darkMode = ref(false)
const deleteAccountDialogVisible = ref(false)
const confirmUsername = ref('')
const username = userStore.username || localStorage.getItem('username') || '用户'

// 个人资料表单
const profileForm = reactive({
  username: username,
  nickname: '',
  email: '',
  phone: '',
  address: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 隐私设置
const privacySettings = reactive({
  collectInfo: true,
  locationAccess: true,
  personalizedRecommendation: true
})

// 反馈表单
const feedbackForm = reactive({
  type: '',
  content: '',
  contact: ''
})

// 收集的数据清单
const collectedData = ref([
  {
    type: '基本信息',
    content: '用户名、昵称、头像',
    purpose: '用于身份识别和展示'
  },
  {
    type: '联系方式',
    content: '手机号、邮箱地址',
    purpose: '用于联系沟通和服务通知'
  },
  {
    type: '交易信息',
    content: '订单记录、支付信息',
    purpose: '用于完成交易和售后服务'
  },
  {
    type: '浏览信息',
    content: '浏览记录、搜索关键词',
    purpose: '用于优化推荐和改善体验'
  },
  {
    type: '设备信息',
    content: '设备型号、操作系统',
    purpose: '用于适配和优化产品'
  }
])

// 切换深色模式
const toggleDarkMode = (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
  ElMessage.success(`${value ? '开启' : '关闭'}深色模式`)
}

// 保存个人资料
const saveProfile = () => {
  ElMessage.success('个人信息已保存')
}

// 修改密码
const changePassword = () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning('请填写完整密码信息')
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  
  // 实际项目中这里会调用API修改密码
  ElMessage.success('密码修改成功')
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 显示注销账号对话框
const showDeleteAccountDialog = () => {
  deleteAccountDialogVisible.value = true
  confirmUsername.value = ''
}

// 关闭对话框前的处理
const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭注销账号窗口吗？')
    .then(() => {
      done()
    })
    .catch(() => {
      // 用户取消关闭
    })
}

// 注销账号
const deleteAccount = () => {
  ElMessageBox.confirm(
    '确定要注销账号吗？此操作不可恢复！',
    '注销确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    // 实际项目中这里会调用API注销账号
    ElMessage.success('账号已注销')
    deleteAccountDialogVisible.value = false
    logout()
  }).catch(() => {
    // 用户取消操作
  })
}

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}

// 提交反馈
const submitFeedback = () => {
  if (!feedbackForm.type || !feedbackForm.content) {
    ElMessage.warning('请填写问题类型和详细描述')
    return
  }
  
  // 实际项目中这里会调用API提交反馈
  ElMessage.success('反馈已提交，我们会尽快处理')
  feedbackForm.type = ''
  feedbackForm.content = ''
  feedbackForm.contact = ''
}

// 初始化数据
onMounted(() => {
  // 获取主题设置
  const savedTheme = localStorage.getItem('theme')
  darkMode.value = savedTheme === 'dark'
  
  // 获取用户信息
  profileForm.nickname = localStorage.getItem('nickname') || ''
  profileForm.email = localStorage.getItem('email') || ''
  profileForm.phone = localStorage.getItem('phone') || ''
  profileForm.address = localStorage.getItem('address') || ''
})
</script>

<style scoped>
.settings-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  padding-bottom: 40px;
  background: #f5f7fa;
}

.settings-container {
  width: 100%;
  max-width: 1200px;
}

.page-title {
  margin-bottom: 20px;
  text-align: center;
}

.settings-tabs {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.setting-card {
  margin-bottom: 20px;
}

.setting-card .el-card__header {
  font-weight: bold;
  font-size: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.setting-label i {
  margin-right: 10px;
  font-size: 16px;
}

.setting-description {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  line-height: 1.5;
}

.danger-zone {
  padding: 10px 0;
}

.danger-zone ul {
  margin: 10px 0 20px 20px;
  font-size: 14px;
  color: #666;
}

.danger-zone ul li {
  margin: 5px 0;
}

.feedback-section {
  padding: 10px 0;
}

.delete-account-warning {
  padding: 20px 0;
}

.confirmation-text {
  margin: 15px 0;
  font-size: 14px;
}

.footer-card {
  margin-top: 10px;
}

.footer-actions {
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.policy-link {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .settings-page {
    padding-top: 10px;
  }
  
  .settings-tabs {
    padding: 15px;
  }
}
</style>