<template>
  <div class="profile-page">
    <div class="profile-container">
      <h2 class="page-title">个人中心</h2>

      <el-tabs v-model="activeTab" class="profile-tabs">
        <!-- 基本信息标签页 -->
        <el-tab-pane label="基本信息" name="basic">
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
        </el-tab-pane>

        <!-- 收藏标签页 -->
        <el-tab-pane label="我的收藏" name="favorites">
          <div class="section-header">
            <h3>我的收藏</h3>
            <el-button @click="clearFavorites" type="danger" plain>清空收藏</el-button>
          </div>
          
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" v-for="item in favorites" :key="item.id">
              <el-card :body-style="{ padding: '0' }" shadow="hover" class="product-card">
                <div class="product-img">
                  <el-image :src="item.image" fit="cover" class="card-image">
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon :size="30"><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="product-info">
                  <el-text class="product-title" truncated>{{ item.title }}</el-text>
                  <el-text type="danger" class="product-price">￥{{ item.price }}</el-text>
                  <div class="product-actions">
                    <el-button type="primary" size="small" @click="removeFromFavorites(item)">移除</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            
            <el-empty v-if="favorites.length === 0" description="暂无收藏商品" />
          </el-row>
        </el-tab-pane>

        <!-- 浏览记录标签页 -->
        <el-tab-pane label="浏览记录" name="history">
          <div class="section-header">
            <h3>浏览记录</h3>
            <el-button @click="clearHistory" type="danger" plain>清空记录</el-button>
          </div>
          
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" v-for="item in history" :key="item.id">
              <el-card :body-style="{ padding: '0' }" shadow="hover" class="product-card">
                <div class="product-img">
                  <el-image :src="item.image" fit="cover" class="card-image">
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon :size="30"><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="product-info">
                  <el-text class="product-title" truncated>{{ item.title }}</el-text>
                  <el-text type="danger" class="product-price">￥{{ item.price }}</el-text>
                  <div class="product-actions">
                    <el-button type="primary" size="small" @click="viewProduct(item)">查看详情</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            
            <el-empty v-if="history.length === 0" description="暂无浏览记录" />
          </el-row>
        </el-tab-pane>

        <!-- 猜你喜欢标签页 -->
        <el-tab-pane label="猜你喜欢" name="recommend">
          <div class="section-header">
            <h3>猜你喜欢</h3>
          </div>
          
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" v-for="item in recommendations" :key="item.id">
              <el-card :body-style="{ padding: '0' }" shadow="hover" class="product-card">
                <div class="product-img">
                  <el-image :src="item.image" fit="cover" class="card-image">
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon :size="30"><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="product-info">
                  <el-text class="product-title" truncated>{{ item.title }}</el-text>
                  <el-text type="danger" class="product-price">￥{{ item.price }}</el-text>
                  <div class="product-actions">
                    <el-button type="primary" size="small" @click="viewProduct(item)">查看详情</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            
            <el-empty v-if="recommendations.length === 0" description="暂无推荐商品" />
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { updateUserProfile, updateUserPassword } from '@/api/user'
import { Picture } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('basic')
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
    ElMessage.error('更新个人信息失败')
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
    ElMessage.error('修改密码失败')
  } finally {
    savingPassword.value = false
  }
}

const backToShop = () => {
  router.push('/shop')
}

// 跳转到售后政策页面
const goToAfterSalesPolicy = () => {
  router.push('/policy/after-sales')
}

// 收藏相关
const favorites = ref([
  {
    id: 1,
    title: 'Vue.js设计与实现',
    price: '99.00',
    image: new URL('@/assets/images/goods1.png', import.meta.url).href
  },
  {
    id: 2,
    title: 'JavaScript高级程序设计',
    price: '129.00',
    image: new URL('@/assets/images/goods2.png', import.meta.url).href
  },
  {
    id: 3,
    title: '你不知道的JavaScript',
    price: '89.00',
    image: new URL('@/assets/images/goods3.png', import.meta.url).href
  },
  {
    id: 4,
    title: 'React进阶之路',
    price: '79.00',
    image: new URL('@/assets/images/goods4.png', import.meta.url).href
  }
])

const removeFromFavorites = (item) => {
  ElMessageBox.confirm(`确定要从收藏中移除《${item.title}》吗？`, '确认操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    favorites.value = favorites.value.filter(fav => fav.id !== item.id)
    ElMessage.success('已从收藏中移除')
  }).catch(() => {
    // 用户取消操作
  })
}

const clearFavorites = () => {
  ElMessageBox.confirm('确定要清空所有收藏吗？', '确认操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    favorites.value = []
    ElMessage.success('收藏已清空')
  }).catch(() => {
    // 用户取消操作
  })
}

// 浏览记录相关
const history = ref([
  {
    id: 5,
    title: '深入浅出Node.js',
    price: '95.00',
    image: new URL('@/assets/images/goods5.png', import.meta.url).href
  },
  {
    id: 6,
    title: 'CSS世界',
    price: '79.00',
    image: new URL('@/assets/images/goods6.png', import.meta.url).href
  },
  {
    id: 7,
    title: '前端架构：从入门到微前端',
    price: '69.00',
    image: new URL('@/assets/images/goods7.png', import.meta.url).href
  },
  {
    id: 8,
    title: 'Web性能权威指南',
    price: '85.00',
    image: new URL('@/assets/images/goods8.png', import.meta.url).href
  }
])

const clearHistory = () => {
  ElMessageBox.confirm('确定要清空所有浏览记录吗？', '确认操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    history.value = []
    ElMessage.success('浏览记录已清空')
  }).catch(() => {
    // 用户取消操作
  })
}

const viewProduct = (item) => {
  ElMessage.info(`查看商品《${item.title}》详情`)
  // 这里可以跳转到商品详情页
}

// 猜你喜欢相关
const recommendations = ref([
  {
    id: 9,
    title: '算法导论',
    price: '128.00',
    image: new URL('@/assets/images/goods1.png', import.meta.url).href
  },
  {
    id: 10,
    title: '设计模式之禅',
    price: '99.00',
    image: new URL('@/assets/images/goods2.png', import.meta.url).href
  },
  {
    id: 11,
    title: '重构：改善既有代码的设计',
    price: '89.00',
    image: new URL('@/assets/images/goods3.png', import.meta.url).href
  },
  {
    id: 12,
    title: '代码大全',
    price: '108.00',
    image: new URL('@/assets/images/goods4.png', import.meta.url).href
  }
])

// 初始化数据
onMounted(() => {
  // 实际项目中这里会调用API获取用户信息
  profileForm.name = localStorage.getItem('username') || '用户'
  profileForm.email = 'user@example.com'
  profileForm.phone = '13800138000'
  profileForm.address = '北京市朝阳区某某街道'
  profileForm.prefer = '编程技术,计算机科学'
})
</script>

<style scoped>
.profile-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  padding-bottom: 40px;
  background: #f5f7fa;
}

.profile-container {
  width: 100%;
  max-width: 1200px;
}

.page-title {
  margin-bottom: 20px;
  text-align: center;
}

.profile-tabs {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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

/* 商品卡片样式 */
.product-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-img {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.product-card:hover .card-image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #c0c4cc;
}

.product-info {
  padding: 12px;
  text-align: center;
}

.product-title {
  display: block;
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  max-width: 100%;
}

.product-price {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-actions {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 10px;
  }
  
  .profile-tabs {
    padding: 15px;
  }
  
  .product-img {
    height: 150px;
  }
}
</style>