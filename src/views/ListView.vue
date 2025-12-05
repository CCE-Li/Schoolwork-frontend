<template>
  <div class="list-page">
    <!-- 固定顶部 -->
    <div class="fixed-header">
      <div class="shortcut">
        <div class="wrapper">
          <el-space :size="0">
            <el-button text class="nav-btn" @click="$router.push('/shop')">
              <el-icon><HomeFilled /></el-icon>返回首页
            </el-button>
            <el-divider direction="vertical" />
            <el-button text class="nav-btn">
              <el-icon><User /></el-icon>个人中心
            </el-button>
            <el-divider direction="vertical" />
            <el-button text class="nav-btn">
              <el-icon><ShoppingCart /></el-icon>购物车
            </el-button>
          </el-space>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="main-content">
      <!-- 搜索区域 -->
      <div class="search-section wrapper">
        <div class="logo">
          <h1><a href="">易购图书</a></h1>
        </div>
        <div class="search-form">
          <el-input
            v-model="searchParams.title"
            placeholder="搜索书名"
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-input
            v-model="searchParams.author"
            placeholder="搜索作者"
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="searchParams.tags"
            placeholder="选择分类"
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            class="tag-select"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon> 重置
          </el-button>
        </div>
      </div>

      <!-- 搜索结果信息 -->
      <div class="result-info wrapper">
        <div class="result-summary">
          <span v-if="hasSearchCondition">
            搜索结果：共找到 <strong>{{ books.length }}</strong> 本图书
            <el-tag
              v-if="searchParams.title"
              type="info"
              closable
              @close="clearCondition('title')"
            >
              书名：{{ searchParams.title }}
            </el-tag>
            <el-tag
              v-if="searchParams.author"
              type="info"
              closable
              @close="clearCondition('author')"
            >
              作者：{{ searchParams.author }}
            </el-tag>
            <el-tag
              v-for="tag in searchParams.tags"
              :key="tag"
              type="info"
              closable
              @close="clearTag(tag)"
            >
              分类：{{ tag }}
            </el-tag>
          </span>
          <span v-else>
            全部图书：共 <strong>{{ books.length }}</strong> 本
          </span>
        </div>
        <div class="sort-options">
          <el-radio-group v-model="sortBy" size="small" @change="handleSort">
            <el-radio-button value="default">默认</el-radio-button>
            <el-radio-button value="price-asc">价格升序</el-radio-button>
            <el-radio-button value="price-desc">价格降序</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 图书列表 -->
      <div class="book-list wrapper" v-loading="loading">
        <el-row :gutter="20" v-if="books.length > 0">
          <el-col
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            v-for="book in books"
            :key="book.bid"
          >
            <el-card
              :body-style="{ padding: '0' }"
              shadow="hover"
              class="book-card"
              @click="goToDetail(book)"
            >
              <div class="book-cover">
                <el-image :src="book.cover" fit="cover" class="cover-image">
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon :size="40"><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="book-tags" v-if="book.tags && book.tags.length">
                  <el-tag
                    v-for="tag in book.tags.slice(0, 2)"
                    :key="tag"
                    size="small"
                    effect="dark"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="book-info">
                <el-text class="book-title" truncated>{{ book.title }}</el-text>
                <el-text class="book-author" type="info" truncated>{{ book.author }}</el-text>
                <div class="book-footer">
                  <el-text type="danger" class="book-price">￥{{ book.price }}</el-text>
                  <el-button
                    type="primary"
                    size="small"
                    circle
                    @click.stop="addToCart(book)"
                  >
                    <el-icon><ShoppingCart /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-else-if="!loading" description="暂无符合条件的图书">
          <el-button type="primary" @click="handleReset">查看全部图书</el-button>
        </el-empty>
      </div>

      <!-- 底部 -->
      <el-footer class="footer">
        <div class="wrapper">
          <div class="copyright">
            <el-text type="info" class="copyright-text">CopyRight © 易购图书</el-text>
          </div>
        </div>
      </el-footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  HomeFilled,
  User,
  UserFilled,
  ShoppingCart,
  Search,
  RefreshRight,
  Picture
} from '@element-plus/icons-vue'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

// 搜索参数
const searchParams = reactive({
  title: '',
  author: '',
  tags: []
})

// 分类选项
const tagOptions = ref([
  '小说', '文学', '历史', '科幻', '悬疑', '经管', '计算机',
  '心理学', '哲学', '艺术', '教育', '童书', '生活', '旅行'
])

// 图书列表
const books = ref([])
const loading = ref(false)
const sortBy = ref('default')

// 是否有搜索条件
const hasSearchCondition = computed(() => {
  return searchParams.title || searchParams.author || searchParams.tags.length > 0
})

// 获取图书列表
const fetchBooks = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchParams.title) params.title = searchParams.title
    if (searchParams.author) params.author = searchParams.author
    if (searchParams.tags.length > 0) params.tags = searchParams.tags.join(',')

    const response = await request.get('/books', { params })
    if (response.data.code === 200) {
      books.value = response.data.data || []
      handleSort()
    } else {
      ElMessage.error(response.data.message || '获取图书列表失败')
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
    ElMessage.error('获取图书列表失败，请稍后重试')
    // 使用模拟数据
    books.value = getMockBooks()
  } finally {
    loading.value = false
  }
}

// 模拟数据
const getMockBooks = () => {
  const mockBooks = [
    { bid: 1, title: '活着', author: '余华', price: 29.00, cover: '', tags: ['小说', '文学'] },
    { bid: 2, title: '三体', author: '刘慈欣', price: 68.00, cover: '', tags: ['科幻', '小说'] },
    { bid: 3, title: '百年孤独', author: '加西亚·马尔克斯', price: 55.00, cover: '', tags: ['小说', '文学'] },
    { bid: 4, title: '人类简史', author: '尤瓦尔·赫拉利', price: 68.00, cover: '', tags: ['历史', '哲学'] },
    { bid: 5, title: '小王子', author: '安托万·德·圣-埃克苏佩里', price: 32.00, cover: '', tags: ['童书', '文学'] },
    { bid: 6, title: '白夜行', author: '东野圭吾', price: 45.00, cover: '', tags: ['悬疑', '小说'] },
    { bid: 7, title: '围城', author: '钱钟书', price: 35.00, cover: '', tags: ['小说', '文学'] },
    { bid: 8, title: '明朝那些事儿', author: '当年明月', price: 198.00, cover: '', tags: ['历史'] },
  ]

  // 根据搜索条件过滤
  return mockBooks.filter(book => {
    if (searchParams.title && !book.title.includes(searchParams.title)) return false
    if (searchParams.author && !book.author.includes(searchParams.author)) return false
    if (searchParams.tags.length > 0) {
      const hasTag = searchParams.tags.some(tag => book.tags.includes(tag))
      if (!hasTag) return false
    }
    return true
  })
}

// 搜索
const handleSearch = () => {
  fetchBooks()
}

// 重置
const handleReset = () => {
  searchParams.title = ''
  searchParams.author = ''
  searchParams.tags = []
  sortBy.value = 'default'
  fetchBooks()
}

// 清除单个条件
const clearCondition = (field) => {
  searchParams[field] = ''
  fetchBooks()
}

// 清除单个标签
const clearTag = (tag) => {
  const index = searchParams.tags.indexOf(tag)
  if (index > -1) {
    searchParams.tags.splice(index, 1)
    fetchBooks()
  }
}

// 排序
const handleSort = () => {
  if (sortBy.value === 'price-asc') {
    books.value.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    books.value.sort((a, b) => b.price - a.price)
  }
}

// 跳转详情
const goToDetail = (book) => {
  router.push(`/books/${book.bid}`)
}

// 加入购物车
const addToCart = (book) => {
  ElMessage.success(`已将《${book.title}》加入购物车`)
}

// 初始化
onMounted(() => {
  // 从路由参数获取搜索条件
  if (route.query.title) searchParams.title = route.query.title
  if (route.query.author) searchParams.author = route.query.author
  if (route.query.tags) searchParams.tags = route.query.tags.split(',')

  fetchBooks()
})
</script>

<style scoped>
.list-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

.fixed-header {
  flex-shrink: 0;
  width: 100%;
  background-color: #fff;
  z-index: 100;
}

.main-content {
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 30px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.wrapper {
  width: 100%;
  box-sizing: border-box;
}

/* 快捷导航 */
.shortcut {
  width: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  padding: 10px 0;
}

.shortcut .wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
}

.nav-btn {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 13px;
  transition: all 0.3s ease;
  padding: 6px 12px !important;
  border-radius: 4px;
}

.nav-btn:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-btn .el-icon {
  margin-right: 4px;
}

.shortcut :deep(.el-divider--vertical) {
  border-color: rgba(255, 255, 255, 0.2);
  height: 14px;
}

/* 搜索区域 */
.search-section {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px 40px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.logo {
  flex-shrink: 0;
}

.logo a {
  display: block;
  width: 150px;
  height: 50px;
  background-image: url("@/assets/yigou.png");
  background-size: contain;
  background-repeat: no-repeat;
  font-size: 0;
}

.search-form {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.tag-select {
  width: 200px;
}

/* 结果信息 */
.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.result-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.result-summary strong {
  color: #409eff;
  font-size: 18px;
}

/* 图书列表 */
.book-list {
  margin-top: 20px;
  min-height: 400px;
}

.book-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18);
  transform: translateY(-6px);
}

.book-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.cover-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.book-card:hover .cover-image {
  transform: scale(1.08);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #adb5bd;
}

.book-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.book-info {
  padding: 12px;
}

.book-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.book-author {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
}

.book-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  font-size: 16px;
  font-weight: bold;
}

/* 底部 */
.footer {
  margin-top: 40px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  height: auto;
}

.copyright {
  text-align: center;
}

.copyright-text {
  display: block;
}

/* 响应式 */
@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .logo {
    text-align: center;
  }

  .search-form {
    flex-direction: column;
  }

  .search-input,
  .tag-select {
    width: 100%;
  }

  .result-info {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
