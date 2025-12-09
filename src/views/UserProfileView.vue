<template>
  <div class="profile-page">
    <div class="profile-container">
      <h2 class="page-title">个人中心</h2>

      <el-row :gutter="20">
        <!-- 账号信息 -->
        <el-col :xs="24" :md="14">
          <el-card shadow="hover" class="card">
            <template #header>
              <span>账号信息</span>
            </template>
            <el-form :model="profileForm" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.name" placeholder="请输入姓名" />
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
              <el-form-item label="偏好">
                <el-input v-model="profileForm.prefer" placeholder="请输入阅读偏好，如：编程、文学" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveProfile" :loading="savingProfile">保存信息</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 修改密码 -->
        <el-col :xs="24" :md="10">
          <el-card shadow="hover" class="card">
            <template #header>
              <span>修改密码</span>
            </template>
            <el-form :model="passwordForm" label-width="90px">
              <el-form-item label="当前用户名">
                <span>{{ username }}</span>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
              </el-form-item>
              <el-form-item label="确认新密码">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleChangePassword" :loading="savingPassword">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card shadow="never" class="card footer-card">
            <div class="footer-actions">
              <el-button @click="backToShop">返回商城</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { updateUserProfile, updateUserPassword } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

const username = userStore.username || localStorage.getItem('username') || '用户'

// 账号信息表单
const profileForm = reactive({
  name: username,
  email: '',
  phone: '',
  address: '',
  prefer: ''
})

const savingProfile = ref(false)

const handleSaveProfile = async () => {
  savingProfile.value = true
  try {
    const res = await updateUserProfile(profileForm)
    if (res.data.code === 200) {
      ElMessage.success('个人信息已更新')
    }
  } catch (error) {
    console.error('更新个人信息失败:', error)
  } finally {
    savingProfile.value = false
  }
}

// 修改密码表单
const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

const savingPassword = ref(false)

const handleChangePassword = async () => {
  if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning('请填写完整新密码信息')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }

  savingPassword.value = true
  try {
    const res = await updateUserPassword({
      username,
      password: passwordForm.newPassword
    })
    if (res.data.code === 200) {
      ElMessage.success('密码修改成功')
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    savingPassword.value = false
  }
}

const backToShop = () => {
  router.push('/shop')
}
</script>

<style scoped>
.profile-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
  background: #f5f7fa;
}

.profile-container {
  width: 100%;
  max-width: 1100px;
}

.page-title {
  margin-bottom: 20px;
}

.card {
  margin-bottom: 20px;
}

.footer-card {
  margin-top: 10px;
}

.footer-actions {
  text-align: right;
}
</style>
状态正常时不要返回 401。*
