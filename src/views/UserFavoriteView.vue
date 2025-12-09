<template>
  <div class="favorite-page">
    <div class="header">
      <h2>我的收藏</h2>
      <div class="header-right">
        <el-text type="info">共 {{ favourites.length }} 本图书</el-text>
        <el-button size="small" @click="goHome">返回首页</el-button>
      </div>
    </div>

    <el-card class="content-card">
      <el-skeleton v-if="loading" :rows="4" animated />

      <template v-else>
        <el-empty v-if="!favourites.length" description="暂无收藏，去商城逛逛吧～" />

        <el-row v-else :gutter="24">
          <el-col
            v-for="item in favourites"
            :key="item.bid || item.id"
            :xs="12"
            :sm="8"
            :md="6"
          >
            <el-card shadow="hover" class="book-card">
              <div class="cover-wrapper" @click="goToList(item)">
                <el-image
                  :src="item.image"
                  fit="cover"
                  class="cover-img"
                >
                  <template #error>
                    <div class="cover-placeholder">
                      <el-icon :size="32"><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="info">
                <el-text class="title" truncated>{{ item.title }}</el-text>
                <el-text type="danger" class="price">
                  ￥{{ item.price ?? '0.00' }}
                </el-text>
                <div class="actions">
                  <el-button size="small" type="primary" plain @click="goToList(item)">
                    去查看
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { getUserFavourites } from '@/api/user'

const router = useRouter()

const loading = ref(false)
const favourites = ref([])

const goHome = () => {
  router.push('/shop')
}

const fetchFavourites = async () => {
  loading.value = true
  try {
    const res = await getUserFavourites()
    const body = res.data

    // 后端当前实现：直接返回 List<Book>
    // 兼容未来可能改成统一响应结构 data / data.list
    let list = []
    if (Array.isArray(body)) {
      list = body
    } else if (Array.isArray(body?.data)) {
      list = body.data
    } else if (Array.isArray(body?.data?.list)) {
      list = body.data.list
    }

    favourites.value = list.map((b) => ({
      bid: b.bid || b.id,
      title: b.title,
      image: b.coverUrl || b.cover_url || b.image || '',
      price:
        typeof b.price === 'number'
          ? b.price.toFixed(2)
          : b.price || '0.00',
    }))
  } catch (e) {
    console.error('获取收藏失败', e)
    ElMessage.error('获取收藏失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goToList = (item) => {
  if (!item?.title) return
  router.push({
    path: '/list',
    query: { title: item.title },
  })
}

onMounted(() => {
  fetchFavourites()
})
</script>

<style scoped>
.favorite-page {
  padding: 24px 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-card {
  border-radius: 8px;
}

.book-card {
  margin-bottom: 16px;
}

.cover-wrapper {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.info {
  margin-top: 8px;
}

.title {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
}

.price {
  display: block;
  margin-bottom: 8px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
