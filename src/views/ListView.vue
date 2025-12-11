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
            <el-button text class="nav-btn" @click="$router.push('/user/profile')">
              <el-icon><User /></el-icon>个人中心
            </el-button>
            <el-divider direction="vertical" />
            <el-button text class="nav-btn" @click="$router.push('/cart')">
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
                <el-image :src="getImageUrl(book.coverUrl || book.cover_url || book.cover)" fit="cover" class="cover-image">
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
                  <div class="book-actions">
                    <el-button
                      type="primary"
                      size="small"
                      circle
                      @click.stop="addToCart(book)"
                    >
                      <el-icon><ShoppingCart /></el-icon>
                    </el-button>
                    <el-button
                      :type="isFavourite(book.bid) ? 'danger' : 'info'"
                      size="small"
                      circle
                      @click.stop="addToFavourite(book)"
                    >
                      <el-icon><StarFilled /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-else-if="!loading" description="暂无符合条件的图书">
          <el-button type="primary" @click="handleReset">查看全部图书</el-button>
        </el-empty>

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="total > 0">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[12, 24, 36, 48]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
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

    <!-- 商品详情弹窗 -->
    <el-dialog
      v-model="productDialogVisible"
      :title="currentProduct?.title"
      width="800px"
      class="product-dialog"
    >
      <div class="product-detail" v-if="currentProduct">
        <div class="detail-content">
          <div class="detail-image">
            <el-image :src="getImageUrl(currentProduct.coverUrl || currentProduct.cover_url || currentProduct.cover)" fit="cover" class="main-image">
              <template #error>
                <div class="image-placeholder">
                  <el-icon :size="60"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="detail-info">
            <h2 class="detail-title">{{ currentProduct.title }}</h2>
            <div class="detail-author" v-if="currentProduct.author">
              <span class="label">作者：</span>
              <span>{{ currentProduct.author }}</span>
            </div>
            <div class="detail-price">
              <span class="price-label">售价</span>
              <span class="price-value">￥{{ (currentProduct.price || 0).toFixed(2) }}</span>
            </div>
            <div class="detail-stock" v-if="currentProduct.stock !== undefined">
              <span class="label">库存：</span>
              <el-tag :type="currentProduct.stock > 0 ? 'success' : 'danger'" size="small">
                {{ currentProduct.stock > 0 ? `${currentProduct.stock} 件` : '暂无库存' }}
              </el-tag>
            </div>
            <div class="detail-desc">
              <h4>商品简介</h4>
              <p>{{ currentProduct.description || '这是一本精彩的图书，内容丰富，值得阅读。' }}</p>
            </div>
            <div class="detail-actions">
              <el-input-number v-model="quantity" :min="1" :max="99" size="large" />
              <el-button type="danger" size="large" @click="handleBuyNow">
                <el-icon><ShoppingCart /></el-icon> 立即购买
              </el-button>
              <el-button type="primary" size="large" @click="handleAddToCart">
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 评论区 -->
        <div class="comment-section">
          <h3>商品评价 ({{ comments.length }})</h3>

          <!-- 发表评论 -->
          <div class="comment-form">
            <div class="rating-row">
              <span>评分：</span>
              <el-rate v-model="newComment.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
            </div>
            <el-input
              v-model="newComment.content"
              type="textarea"
              :rows="3"
              placeholder="分享您的读书体验..."
              maxlength="500"
              show-word-limit
            />
            <el-button type="primary" @click="submitComment" :disabled="!newComment.content">
              发表评论
            </el-button>
          </div>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div class="comment-item" v-for="(comment, index) in comments" :key="index">
              <div class="comment-header">
                <el-avatar :size="40" icon="User" />
                <div class="comment-meta">
                  <span class="comment-user">{{ comment.user }}</span>
                  <el-rate v-model="comment.rating" disabled size="small" />
                </div>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
            </div>
            <el-empty v-if="comments.length === 0" description="暂无评论，快来发表第一条评论吧！" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  User,
  UserFilled,
  ShoppingCart,
  Search,
  RefreshRight,
  Picture,
  StarFilled
} from '@element-plus/icons-vue'
import request from '@/utils/request'
import { createOrderDirectly } from '@/api/order'
import { getBookDetail, addBookComment } from '@/api/book'
import { getUserFavourites, addFavourite, deleteFavourite } from '@/api/user'
import { addToCart as addToCartApi } from '@/api/cart'

const router = useRouter()
const route = useRoute()
const uid = localStorage.getItem('userId') || localStorage.getItem('uid')

// 搜索参数
const searchParams = reactive({
  title: '',
  author: '',
  tags: []
})

// 分类选项（从后端数据动态生成）
const tagOptions = ref([])

// 图书列表
const books = ref([])
const loading = ref(false)
const sortBy = ref('default')
const total = ref(0)

// 收藏相关
const favouriteBids = ref([])

const isFavourite = (bid) => {
  if (!bid) return false
  return favouriteBids.value.includes(bid)
}

const loadFavourites = async () => {
  try {
    const res = await getUserFavourites()
    const body = res.data
    let list = []
    if (Array.isArray(body)) {
      list = body
    } else if (Array.isArray(body?.data)) {
      list = body.data
    } else if (Array.isArray(body?.data?.list)) {
      list = body.data.list
    }
    favouriteBids.value = list.map(b => b.bid || b.id).filter(Boolean)
  } catch (error) {
    console.error('加载收藏列表失败:', error)
  }
}

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 12
})

// 处理图片URL
const getImageUrl = (url) => {
  if (!url) return ''
  return url
}

// 是否有搜索条件
const hasSearchCondition = computed(() => {
  return searchParams.title || searchParams.author || searchParams.tags.length > 0
})

// 获取图书列表
const fetchBooks = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchParams.title) params.title = searchParams.title
    if (searchParams.author) params.author = searchParams.author
    if (searchParams.tags.length > 0) params.tags = searchParams.tags.join(',')

    const response = await request.get('/books', { params })
    const res = response.data
    // 兼容两种返回格式：直接数组 或 { code, data } 结构
    if (Array.isArray(res)) {
      books.value = res
      total.value = res.length
    } else if (res.code === 200) {
      // 分页返回格式: { data: { list, total } } 或 { data: [] }
      if (res.data && res.data.list) {
        books.value = res.data.list || []
        total.value = res.data.total || 0
      } else if (Array.isArray(res.data)) {
        books.value = res.data
        total.value = res.data.length
      } else {
        books.value = res.data || []
        total.value = res.total || 0
      }
    } else if (res.data && Array.isArray(res.data)) {
      books.value = res.data
      total.value = res.total || res.data.length
    } else {
      ElMessage.error(res.message || '获取图书列表失败')
      books.value = []
      total.value = 0
    }

    // 只显示上架状态的图书（status === 1）
    books.value = books.value.filter(book => book && book.status === 1)

    handleSort()
  } catch (error) {
    console.error('获取图书列表失败:', error)
    ElMessage.error('获取图书列表失败，请稍后重试')
    // 使用模拟数据
    books.value = getMockBooks()
    total.value = books.value.length
  } finally {
    loading.value = false
  }
}

// 前端循环分页查询所有图书，用于汇总全部分类选项
const fetchAllTagsByLoop = async () => {
  try {
    const pageSize = 100 // 为标签汇总单独设置一个较大的 pageSize
    let page = 1
    let totalPages = 1
    const tagSet = new Set()

    do {
      const resp = await request.get('/books', {
        params: {
          page,
          pageSize
        }
      })
      const data = resp.data

      let list = []
      let totalCount = 0
      if (Array.isArray(data)) {
        list = data
        totalCount = data.length
      } else if (data.code === 200 && data.data) {
        if (Array.isArray(data.data.list)) {
          list = data.data.list
          totalCount = data.data.total || list.length
        } else if (Array.isArray(data.data)) {
          list = data.data
          totalCount = data.data.length
        }
      }

      // 累计当前页的标签
      list.forEach(book => {
        if (!book) return

        // tagArray: ["编程", "数据结构", ...]
        if (Array.isArray(book.tagArray)) {
          book.tagArray.forEach(t => {
            const tag = String(t).trim()
            if (tag) tagSet.add(tag)
          })
        }

        // tags: "编程,数据结构,算法"
        if (book.tags && typeof book.tags === 'string') {
          book.tags.split(/[,，]/).forEach(t => {
            const tag = t.trim()
            if (tag) tagSet.add(tag)
          })
        }
      })

      // 计算总页数并推进页码
      if (page === 1 && totalCount > 0) {
        totalPages = Math.ceil(totalCount / pageSize)
      }
      page += 1
    } while (page <= totalPages)

    tagOptions.value = Array.from(tagSet)
  } catch (error) {
    console.error('汇总分类标签失败:', error)
  }
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchBooks()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.page = page
  fetchBooks()
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
  pagination.page = 1
  fetchBooks()
}

// 重置
const handleReset = () => {
  searchParams.title = ''
  searchParams.author = ''
  searchParams.tags = []
  sortBy.value = 'default'
  pagination.page = 1
  fetchBooks()
}

// 清除单个条件
const clearCondition = (field) => {
  searchParams[field] = ''
  pagination.page = 1
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
    books.value.sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (sortBy.value === 'price-desc') {
    books.value.sort((a, b) => (b.price || 0) - (a.price || 0))
  } else {
    // 默认：按书名的字典序排序
    books.value.sort((a, b) => {
      const ta = (a.title || '').toString()
      const tb = (b.title || '').toString()
      return ta.localeCompare(tb)
    })
  }
}

// 商品详情弹窗
const productDialogVisible = ref(false)
const currentProduct = ref(null)
const quantity = ref(1)

// 评论数据
const comments = ref([])
const commentsLoading = ref(false)

const newComment = ref({
  rating: 5,
  content: ''
})

// 获取图书评论
const fetchComments = async (bid) => {
  if (!bid) {
    comments.value = []
    return
  }
  commentsLoading.value = true
  try {
    const res = await getBookDetail(bid)
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data
      if (Array.isArray(data.comments)) {
        comments.value = data.comments.map(c => ({
          user: c.username || c.user || '匿名用户',
          rating: c.rating || 5,
          content: c.comment || c.content || '',
          time: c.create_time || c.time || ''
        }))
      } else if (Array.isArray(data.reviews)) {
        comments.value = data.reviews.map(c => ({
          user: c.username || c.user || '匿名用户',
          rating: c.rating || 5,
          content: c.comment || c.content || '',
          time: c.create_time || c.time || ''
        }))
      } else {
        comments.value = []
      }
    }
  } catch (error) {
    console.error('获取评论失败:', error)
    comments.value = []
  } finally {
    commentsLoading.value = false
  }
}

// 打开商品详情
const goToDetail = async (book) => {
  currentProduct.value = book
  quantity.value = 1
  productDialogVisible.value = true
  await fetchComments(book.bid)
}

// 立即购买
const handleBuyNow = async () => {
  if (!currentProduct.value.bid) {
    ElMessage.success('订单创建成功')
    productDialogVisible.value = false
    router.push({ path: '/user/orders', query: { newOrder: 'true' } })
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认购买 ${quantity.value} 本《${currentProduct.value.title}》？`,
      '确认购买',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const res = await createOrderDirectly({
      bid: currentProduct.value.bid,
      number: quantity.value,
      addressId: 1
    })

    if (res.data.code === 200) {
      ElMessage.success('订单创建成功，请尽快付款')
      productDialogVisible.value = false
      router.push({ path: '/user/orders', query: { newOrder: 'true' } })
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('创建订单失败:', error)
    }
  }
}

// 加入购物车（弹窗内）
const handleAddToCart = async () => {
  if (!currentProduct.value?.bid) {
    ElMessage.warning('该商品暂不支持加入购物车')
    return
  }
  try {
    const res = await addToCartApi({
      uid,
      bid: currentProduct.value.bid,
      number: quantity.value || 1
    })
    if (res.data && res.data.code === 200) {
      ElMessage.success(`已将 ${quantity.value} 本《${currentProduct.value.title}》加入购物车`)
    } else {
      ElMessage.error(res.data?.message || '加入购物车失败')
    }
  } catch (e) {
    console.error('加入购物车失败:', e)
    ElMessage.error('加入购物车失败，请稍后重试')
  }
}

// 加入购物车（列表直接点击）
const addToCart = async (book) => {
  if (!book?.bid) {
    ElMessage.warning('该商品暂不支持加入购物车')
    return
  }
  try {
    const res = await addToCartApi({
      uid,
      bid: book.bid,
      number: 1
    })
    if (res.data && res.data.code === 200) {
      ElMessage.success(`已将《${book.title}》加入购物车`)
    } else {
      ElMessage.error(res.data?.message || '加入购物车失败')
    }
  } catch (e) {
    console.error('加入购物车失败:', e)
    ElMessage.error('加入购物车失败，请稍后重试')
  }
}

// 收藏 / 取消收藏
const addToFavourite = async (book) => {
  if (!book || !book.bid) {
    ElMessage.warning('该商品暂不支持收藏')
    return
  }

  const bid = book.bid
  const already = isFavourite(bid)

  try {
    if (already) {
      await deleteFavourite(bid)
      favouriteBids.value = favouriteBids.value.filter(id => id !== bid)
      ElMessage.success(`已取消收藏《${book.title}》`)
    } else {
      await addFavourite(bid)
      if (!favouriteBids.value.includes(bid)) {
        favouriteBids.value.push(bid)
      }
      ElMessage.success(`已收藏《${book.title}》`)
    }
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.content.trim()) return

  if (!currentProduct.value?.bid) {
    ElMessage.warning('无法评论此商品')
    return
  }

  try {
    const res = await addBookComment(currentProduct.value.bid, {
      rating: newComment.value.rating,
      comment: newComment.value.content
    })

    if (res.data.code === 200) {
      comments.value.unshift({
        user: localStorage.getItem('username') || '匿名用户',
        rating: newComment.value.rating,
        content: newComment.value.content,
        time: new Date().toLocaleDateString()
      })
      newComment.value.content = ''
      newComment.value.rating = 5
      ElMessage.success('评论发表成功')
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error('发表评论失败，请稍后重试')
  }
}

// 初始化
onMounted(() => {
  // 从路由参数获取搜索条件
  // 支持 keyword 参数（从首页搜索框跳转）
  if (route.query.keyword) {
    searchParams.title = route.query.keyword
  }
  if (route.query.title) searchParams.title = route.query.title
  if (route.query.author) searchParams.author = route.query.author
  if (route.query.tags) searchParams.tags = route.query.tags.split(',')

  // 1. 加载当前页图书
  fetchBooks()
  // 2. 前端循环分页，汇总全部分类
  fetchAllTagsByLoop()
  // 3. 加载当前用户收藏状态
  loadFavourites()
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

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
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

/* 商品详情弹窗 */
.product-detail {
  padding: 0 10px;
}

.detail-content {
  display: flex;
  gap: 30px;
}

.detail-image {
  flex-shrink: 0;
  width: 280px;
  height: 350px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.detail-image .main-image {
  width: 100%;
  height: 100%;
}

.detail-image .image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #adb5bd;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.detail-author {
  margin-bottom: 12px;
  color: #606266;
}

.detail-author .label {
  color: #909399;
}

.detail-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
  padding: 15px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  border-radius: 8px;
}

.price-label {
  font-size: 14px;
  color: #909399;
}

.price-value {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
}

.detail-stock {
  margin-bottom: 12px;
}

.detail-stock .label {
  color: #909399;
  margin-right: 8px;
}

.detail-desc {
  margin-bottom: 20px;
}

.detail-desc h4 {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.detail-desc p {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

/* 评论区 */
.comment-section h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 20px;
}

.comment-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.comment-form .el-button {
  margin-top: 12px;
}

.comment-list {
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.comment-meta {
  flex: 1;
}

.comment-user {
  display: block;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
  padding-left: 52px;
}
</style>
