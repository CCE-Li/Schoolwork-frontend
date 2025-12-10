<template>
  <div class="shop-page">
    <!-- 固定顶部 -->
    <div class="fixed-header">
      <!-- 快捷导航 -->
      <div class="shortcut">
      <div class="wrapper">
        <el-space :size="0">
          <el-dropdown @command="handleUserCommand">
            <el-button text class="nav-btn">
              <el-icon><User /></el-icon>{{ currentUsername }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>设置
                </el-dropdown-item>
                <el-dropdown-item command="switch" divided>
                  <el-icon><Switch /></el-icon>切换账号
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-divider direction="vertical" />
          <el-button text class="nav-btn" @click="goToOrders">
            <el-icon><Document /></el-icon>我的订单
          </el-button>
          <el-divider direction="vertical" />
          <el-button text class="nav-btn">
            <el-icon><Bell /></el-icon>消息中心
          </el-button>
          <el-divider direction="vertical" />
          <el-button text class="nav-btn" @click="about">
            <el-icon><QuestionFilled /></el-icon>帮助中心
          </el-button>
          <el-divider direction="vertical" />
          <el-button text class="nav-btn">
            <el-icon><Service /></el-icon>在线客服
          </el-button>
          <el-divider direction="vertical" />
          <el-button text class="nav-btn">
            <el-icon><Setting /></el-icon>设置
          </el-button>
          <el-divider direction="vertical" />
          <el-popover placement="bottom" :width="150" trigger="hover">
            <template #reference>
              <el-button text class="nav-btn">
                <el-icon><Iphone /></el-icon>手机版
              </el-button>
            </template>
            <div class="qrcode-popover">
              <el-image :src="phoneQrcode" fit="cover" style="width: 120px; height: 120px;" />
              <el-text type="info" size="small">扫码预览手机网页</el-text>
            </div>
          </el-popover>
        </el-space>
      </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="main-content">
      <!-- 头部区域 -->
      <div class="header wrapper">
        <!-- logo -->
        <div class="logo">
          <h1><a href="">易购图书</a></h1>
        </div>
        <!-- 搜索 -->
        <div class="search-box">
          <el-input
            v-model="searchText"
            size="large"
            :placeholder="currentPlaceholder"
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        <!-- 购物车 -->
        <div class="cart">
          <el-badge :value="0" :max="99" class="cart-badge">
            <el-button type="danger" plain @click="goToCart">
              <el-icon><ShoppingCart /></el-icon>
              购物车
            </el-button>
          </el-badge>
        </div>
      </div>

      <!-- banner区域 -->
    <div class="banner-section">
      <div class="wrapper banner-wrapper">
        <!-- 侧栏导航 -->
        <el-menu
          class="side-menu"
          background-color="#3f3e3e"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-sub-menu v-for="(nav, index) in navItems" :key="index" :index="String(index)">
            <template #title>
              <span>{{ nav.title }}</span>
            </template>
            <el-menu-item
              v-for="(item, idx) in nav.desc.split(' ')"
              :key="idx"
              :index="`${index}-${idx}`"
              @click="goToListWithTag(item)"
            >
              {{ item }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <!-- 轮播图 -->
        <el-carousel
          :interval="3000"
          height="500px"
          class="banner-carousel"
          indicator-position="outside"
        >
          <el-carousel-item v-for="(img, index) in bannerImages" :key="index">
            <img :src="img" alt="" class="banner-img" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 易购上新 -->
    <div class="section wrapper">
      <div class="section-header">
        <div class="section-title">
          <h3>易购上新</h3>
          <el-tag type="success" effect="plain">易购精选 品质保障</el-tag>
        </div>
        <el-button type="primary" link @click="gotoList">
          查看全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="30">
        <el-col :xs="12" :sm="12" :md="6" v-for="(item, index) in newProducts" :key="index">
          <el-card :body-style="{ padding: '0' }" shadow="hover" class="product-card" @click="openProductDetail(item)">
            <div class="product-img">
              <el-image :src="item.image" fit="cover" class="card-image">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon :size="40"><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="product-info">
              <el-text class="product-title" truncated>{{ item.title }}</el-text>
              <el-text type="danger" class="product-price">￥{{ item.price }}</el-text>
              <el-button type="primary" size="small" class="add-cart-btn" @click.stop="addToCartDirect(item)">
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 好物推荐 -->
    <div class="section wrapper">
      <div class="section-header">
        <div class="section-title">
          <h3>好物推荐</h3>
          <el-tag type="warning" effect="plain">中外名著 经典永存</el-tag>
        </div>
        <el-button type="primary" link @click="gotoList">
          查看全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="30">
        <el-col :xs="12" :sm="12" :md="6" v-for="(item, index) in recommendProducts" :key="index">
          <el-card :body-style="{ padding: '0' }" shadow="hover" class="product-card" @click="openProductDetail(item)">
            <div class="product-img">
              <el-image :src="item.image" fit="cover" class="card-image">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon :size="40"><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="product-info">
              <el-text class="product-title" truncated>{{ item.title }}</el-text>
              <el-text type="danger" class="product-price">￥{{ item.price }}</el-text>
              <el-button type="primary" size="small" class="add-cart-btn" @click.stop="addToCartDirect(item)">
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 底部区域 -->
    <el-footer class="footer">
      <div class="wrapper">
        <!-- 服务 -->
        <el-row class="service-row" justify="space-around">
          <el-col :span="6" v-for="(service, index) in serviceItems" :key="index">
            <div class="service-item">
              <el-icon :size="40" color="#409EFF">
                <component :is="service.icon" />
              </el-icon>
              <span>{{ service.text }}</span>
            </div>
          </el-col>
        </el-row>

        <el-divider />

        <!-- 帮助中心 -->
        <div class="help-section">
          <div class="help-grid">
            <div class="help-block" v-for="(help, index) in helpItems" :key="index">
              <h4>{{ help.title }}</h4>
              <ul>
                <li v-for="(item, idx) in help.items" :key="idx">
                  <template v-if="typeof item === 'object' && item.link">
                    <el-link :href="item.link" type="info">{{ item.text }}</el-link>
                  </template>
                  <template v-else>
                    <el-text type="info">{{ typeof item === 'object' ? item.text : item }}</el-text>
                  </template>
                </li>
              </ul>
            </div>
            <div class="qrcode-section">
              <div class="qrcode-item">
                <el-image :src="wechatQrcode" fit="cover" class="qrcode-img" />
                <el-text type="info">微信公众号</el-text>
              </div>
              <div class="qrcode-item">
                <el-image :src="appQrcode" fit="cover" class="qrcode-img" />
                <el-text type="info">App下载</el-text>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 版权 -->
        <div class="copyright">
          <el-space :size="10" wrap>
            <el-link type="info">关于我们</el-link>
            <el-divider direction="vertical" />
            <el-link type="info">配送验收</el-link>
            <el-divider direction="vertical" />
            <el-link type="info">合作招商</el-link>
            <el-divider direction="vertical" />
            <el-link type="info">销售中心</el-link>
            <el-divider direction="vertical" />
            <el-link type="info">友情链接</el-link>
            <el-divider direction="vertical" />
            <el-link type="info">质量公告</el-link>
          </el-space>
          <el-text type="info" class="copyright-text">CopyRight © 易购图书</el-text>
        </div>
      </div>
    </el-footer>
    </div>

    <!-- 商品详情弹窗 -->
    <el-dialog
      v-model="productDialogVisible"
      :title="currentProduct?.title"
      width="1000px"
      class="product-dialog"
      destroy-on-close
      top="8vh"
      :lock-scroll="true"
    >
      <div class="product-detail" v-if="currentProduct">
        <!-- 商品信息区 -->
        <div class="detail-main">
          <div class="detail-image">
            <el-image :src="currentProduct.image" fit="cover" class="main-image" />
          </div>
          <div class="detail-info">
            <h2 class="detail-title">{{ currentProduct.title }}</h2>
            <div class="detail-price">
              <span class="price-label">售价</span>
              <span class="price-value">￥{{ currentProduct.price }}</span>
            </div>
            <div class="detail-desc">
              <h4>商品简介</h4>
              <p>{{ currentProduct.description || '这是一本精彩的图书，内容丰富，值得阅读。本书涵盖了丰富的知识点，适合各个年龄段的读者阅读。' }}</p>
            </div>
            <div class="detail-actions">
              <el-input-number v-model="quantity" :min="1" :max="99" size="large" />
              <el-button type="danger" size="large" @click="buyNow">
                <el-icon><ShoppingCart /></el-icon> 立即购买
              </el-button>
              <el-button type="primary" size="large" @click="addToCart">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createOrderDirectly } from '@/api/order'
import { getBookList, getBookDetail, addBookComment } from '@/api/book'
import {
  User,
  Document,
  Bell,
  QuestionFilled,
  Service,
  Setting,
  Iphone,
  Search,
  ShoppingCart,
  ArrowRight,
  ArrowDown,
  PriceTag,
  Van,
  Medal,
  Headset,
  Switch,
  SwitchButton,
  Picture
} from '@element-plus/icons-vue'

const router = useRouter()

// 当前用户名
const currentUsername = ref(localStorage.getItem('username') || '用户')

// 用户菜单处理
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'switch':
      // 切换账号：清除当前登录信息，跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('isLoggedIn')
      ElMessage.success('请登录其他账号')
      router.push('/login')
      break
    case 'logout':
      // 退出登录
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('isLoggedIn')
      ElMessage.success('退出登录成功')
      router.push('/login')
      break
  }
}

// 搜索相关
const searchText = ref('')

// 执行搜索
const handleSearch = () => {
  const keyword = searchText.value.trim()
  if (keyword) {
    router.push({ path: '/list', query: { keyword } })
  } else {
    router.push('/list')
  }
}
const placeholderTexts = ['搜一搜', '热销书籍', '猜你喜欢']
const currentPlaceholderIndex = ref(0)
const currentPlaceholder = ref(placeholderTexts[0])
let placeholderTimer = null

// 跳转到购物车页面
const goToCart = () => {
  router.push('/cart')
}

const bannerImages = ref([
  new URL('@/assets/images/1.png', import.meta.url).href,
  new URL('@/assets/images/2.png', import.meta.url).href,
  new URL('@/assets/images/3.png', import.meta.url).href,
  new URL('@/assets/images/4.png', import.meta.url).href
])

// 二维码图片
const phoneQrcode = new URL('@/assets/images/phone.png', import.meta.url).href
const wechatQrcode = new URL('@/assets/images/wechat.png', import.meta.url).href
const appQrcode = new URL('@/assets/images/app.png', import.meta.url).href

// 侧栏导航数据
const navItems = ref([
  { title: '文学艺术', desc: '小说 文学 艺术 传记' },
  { title: '人文社科', desc: '历史 哲学 宗教 心理' },
  { title: '少儿图书', desc: '儿童文学 启蒙益智' },
  { title: '教育考试', desc: '中小辅导 外语学习' },
  { title: '经济金融', desc: '管理 经济 金融会计' },
  { title: '生活休闲', desc: '烹饪美食 育儿早教' },
  { title: '科学技术', desc: '工业科技 建筑 医学' }
])

// 新品数据
const newProducts = ref([
  { image: new URL('@/assets/images/goods1.png', import.meta.url).href, title: '小幻想家系列丛书(共6册)', price: '61.00' },
  { image: new URL('@/assets/images/goods2.png', import.meta.url).href, title: '"十五五"战略与中国式现代化：新形势、新思路、新举措', price: '69.80' },
  { image: new URL('@/assets/images/goods3.png', import.meta.url).href, title: '台湾百科全书·历史', price: '91.00' },
  { image: new URL('@/assets/images/goods4.png', import.meta.url).href, title: '薛定谔的猫 : 在不确定的世界做确定的自己', price: '49.80' },
  { image: new URL('@/assets/images/goods5.png', import.meta.url).href, title: '朝花夕拾', price: '39.80' },
  { image: new URL('@/assets/images/goods6.png', import.meta.url).href, title: '鼠疫', price: '49.80' },
  { image: new URL('@/assets/images/goods7.png', import.meta.url).href, title: '活着（2021版）', price: '45.00' },
  { image: new URL('@/assets/images/goods8.png', import.meta.url).href, title: '你当像鸟飞往你的山', price: '59.00' }
])

// 推荐商品数据
const recommendProducts = ref([
  { image: new URL('@/assets/images/goods5.png', import.meta.url).href, title: '朝花夕拾', price: '39.80' },
  { image: new URL('@/assets/images/goods6.png', import.meta.url).href, title: '鼠疫', price: '49.80' },
  { image: new URL('@/assets/images/goods7.png', import.meta.url).href, title: '活着（2021版）', price: '45.00' },
  { image: new URL('@/assets/images/goods8.png', import.meta.url).href, title: '你当像鸟飞往你的山', price: '59.00' },
  { image: new URL('@/assets/images/goods1.png', import.meta.url).href, title: '小幻想家系列丛书(共6册)', price: '61.00' },
  { image: new URL('@/assets/images/goods2.png', import.meta.url).href, title: '"十五五"战略与中国式现代化', price: '69.80' },
  { image: new URL('@/assets/images/goods3.png', import.meta.url).href, title: '台湾百科全书·历史', price: '91.00' },
  { image: new URL('@/assets/images/goods4.png', import.meta.url).href, title: '薛定谔的猫', price: '49.80' }
])

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
      // 评论可能在 comments 或 reviews 字段
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
const openProductDetail = async (product) => {
  currentProduct.value = product
  quantity.value = 1
  productDialogVisible.value = true
  // 获取评论
  await fetchComments(product.bid)
}

// 立即购买
const buyNow = async () => {
  // 检查商品是否有bid（真实商品）
  if (!currentProduct.value.bid) {
    // 模拟商品，直接跳转到订单页面
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
      addressId: 1 // 默认地址ID，实际应该让用户选择
    })

    if (res.data.code === 200) {
      ElMessage.success('订单创建成功，请尽快付款')
      productDialogVisible.value = false
      // 跳转到订单页面，显示待付款订单
      router.push({ path: '/user/orders', query: { newOrder: 'true' } })
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('创建订单失败:', error)
    }
  }
}
// 跳转到list界面
const gotoList = () => {
  router.push("/list")
}

// 从首页根据分类跳转到列表页并按分类查询
const goToListWithTag = (tag) => {
  const t = (tag || '').toString().trim()
  if (!t) {
    router.push('/list')
  } else {
    router.push({
      path: '/list',
      query: { tags: t }
    })
  }
}

// 跳转到about
const about = () => {
  router.push('/about')
}

// 跳转到我的订单
const goToOrders = () => {
  router.push('/user/orders')
}

// 跳转到购物车
const goToCart = () => {
  router.push('/cart')
}

// 加入购物车
const addToCart = () => {
  ElMessage.success(`已将 ${quantity.value} 本《${currentProduct.value.title}》加入购物车`)
}

// 直接加入购物车（不打开弹窗）
const addToCartDirect = (product) => {
  ElMessage.success(`已将《${product.title}》加入购物车`)
}

// 发表评论
const submitComment = async () => {
  if (!newComment.value.content.trim()) return

  // 检查是否有图书ID
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
      // 添加到本地列表
      comments.value.unshift({
        user: localStorage.getItem('username') || '我',
        rating: newComment.value.rating,
        content: newComment.value.content,
        time: new Date().toLocaleDateString()
      })
      newComment.value = { rating: 5, content: '' }
      ElMessage.success('评论发表成功！')
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error('发表评论失败，请稍后重试')
  }
}

// 服务数据
const serviceItems = ref([
  { icon: PriceTag, text: '价格亲民' },
  { icon: Van, text: '物流快捷' },
  { icon: Medal, text: '正版保障' },
  { icon: Headset, text: '售后无忧' }
])

// 帮助中心数据
const helpItems = ref([
  { title: '购物指南', items: ['购物流程', '支付方式', '售后规则'] },
  { title: '配送方式', items: ['配送范围', '配送时间'] },
  { title: '关于我们', items: ['联系我们', '问题反馈'] },
  { title: '售后服务', items: [
      { text: '售后政策', link: '/policy/after-sales' }, 
      '退换说明', 
      '取消订单'
    ] 
  },
  { title: '服务热线', items: ['客服电话 400-0000-000', '人工客服 周一至周日8：00-18：00', { text: 'AI客服', link: '#' }] }
])

// 搜索框文字轮换
const startPlaceholderRotation = () => {
  placeholderTimer = setInterval(() => {
    currentPlaceholderIndex.value = (currentPlaceholderIndex.value + 1) % placeholderTexts.length
    currentPlaceholder.value = placeholderTexts[currentPlaceholderIndex.value]
  }, 3000)
}

// 加载真实图书数据
const fetchBooks = async () => {
  try {
    const res = await getBookList({})
    if (res.data.code === 200) {
      // 兼容分页和非分页返回格式
      let books = []
      if (res.data.data && res.data.data.list) {
        books = res.data.data.list
      } else if (Array.isArray(res.data.data)) {
        books = res.data.data
      }

      // 处理图书数据格式
      const formattedBooks = books.map(book => ({
        bid: book.bid,
        image: book.coverUrl || book.cover_url || '',
        title: book.title,
        price: book.price?.toFixed(2) || '0.00',
        author: book.author,
        description: book.description,
        stock: book.stock,
        status: book.status
      })).filter(book => book.status === 1) // 只显示上架的图书

      // 分配到新品和推荐（各8本）
      if (formattedBooks.length > 0) {
        // 新品取前8本
        newProducts.value = formattedBooks.slice(0, 8)
        // 推荐取第9-16本
        if (formattedBooks.length > 8) {
          // 如果有超过8本，推荐显示第9-16本，不足8本则补充前面的
          const recommend = formattedBooks.slice(8, 16)
          if (recommend.length < 8) {
            const need = 8 - recommend.length
            recommendProducts.value = [...recommend, ...formattedBooks.slice(0, need)]
          } else {
            recommendProducts.value = recommend
          }
        } else {
          // 数据不足8本时，推荐商品复用新品数据
          recommendProducts.value = formattedBooks.slice(0, 8)
        }
      }
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
  }
}

onMounted(() => {
  startPlaceholderRotation()
  fetchBooks()
})

onUnmounted(() => {
  if (placeholderTimer) {
    clearInterval(placeholderTimer)
  }
})

// 导出方法供模板使用
defineExpose({
  goToCart
})
</script>

<style scoped>
/* 页面容器 */
.shop-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

/* 固定顶部 */
.fixed-header {
  flex-shrink: 0;
  width: 100%;
  background-color: #fff;
  z-index: 100;
}

/* 内容区域 */
.main-content {
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 120px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.main-content::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* 版心 */
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
  padding: 0 120px;
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

/* 头部 */
.header {
  display: flex;
  align-items: center;
  padding: 20px 40px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* logo */
.logo {
  flex-shrink: 0;
  margin-right: 40px;
}

.logo a {
  display: block;
  width: 180px;
  height: 60px;
  background-image: url("@/assets/yigou.png");
  background-size: contain;
  background-repeat: no-repeat;
  font-size: 0;
}

/* 搜索区域 */
.search-box {
  flex: 1;
  max-width: 600px;
  margin-right: 40px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px 0 0 20px;
}

.search-input :deep(.el-input-group__append) {
  border-radius: 0 20px 20px 0;
}

/* 购物车 */
.cart {
  flex-shrink: 0;
}

.cart-badge :deep(.el-badge__content) {
  top: 8px;
  right: 15px;
}

/* banner区域 */
.banner-section {
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.banner-wrapper {
  display: flex;
  padding: 0 !important;
  overflow: hidden;
  border-radius: 8px;
}

.side-menu {
  width: 220px;
  height: 500px;
  flex-shrink: 0;
  border: none;
  overflow-y: auto;
  border-radius: 12px 0 0 12px;
}

.side-menu :deep(.el-sub-menu__title) {
  font-size: 15px;
}

.banner-carousel {
  flex: 1;
  border-radius: 0 12px 12px 0;
  overflow: hidden;
}

.banner-carousel :deep(.el-carousel__container) {
  border-radius: 0 12px 12px 0;
  overflow: hidden;
}

.banner-carousel :deep(.el-carousel__item) {
  border-radius: 0 12px 12px 0;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品区块 */
.section {
  margin-top: 40px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title h3 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 商品卡片 */
.product-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  transform: translateY(0);
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18);
  transform: translateY(-6px);
}

.product-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
}

.product-card:hover .card-image {
  transform: scale(1.08);
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
  padding: 16px;
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
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.add-cart-btn {
  width: 100%;
}

/* 底部 */
.footer {
  margin-top: 60px;
  padding: 40px 120px;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  height: auto;
}

.service-row {
  padding: 20px 0;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.service-item span {
  font-size: 16px;
  color: #606266;
}

/* 帮助中心 */
.help-section {
  padding: 30px 0;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
}

.help-block h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.help-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-block li {
  margin-bottom: 12px;
  font-size: 14px;
}

/* 二维码 */
.qrcode-section {
  display: flex;
  gap: 24px;
  justify-content: flex-end;
}

.qrcode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qrcode-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

/* 版权 */
.copyright {
  text-align: center;
  padding-top: 20px;
}

.copyright-text {
  display: block;
  margin-top: 16px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .header {
    flex-wrap: wrap;
    gap: 16px;
  }

  .logo {
    margin-right: 0;
  }

  .search-box {
    order: 3;
    max-width: 100%;
    margin-right: 0;
    width: 100%;
  }

  .side-menu {
    display: none;
  }

  .banner-carousel {
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .shortcut .wrapper {
    justify-content: center;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .logo {
    text-align: center;
  }

  .cart {
    text-align: center;
  }

  .section {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .qrcode-section {
    justify-content: center;
    margin-top: 20px;
  }
}

/* 商品详情弹窗 */
.product-detail {
  max-height: 80vh;
  overflow-y: auto;
}

.detail-main {
  display: flex;
  gap: 30px;
}

.detail-image {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.main-image {
  width: 100%;
  height: 100%;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.detail-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
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

.detail-desc h4 {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.detail-desc p {
  font-size: 14px;
  color: #909399;
  line-height: 1.8;
  margin: 0;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: auto;
  padding-top: 20px;
}

/* 评论区 */
.comment-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.comment-form {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.rating-row span {
  font-size: 14px;
  color: #606266;
}

.comment-form .el-button {
  margin-top: 12px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  padding: 16px;
  background-color: #fafafa;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.comment-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-user {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
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

/* 弹窗响应式 */
@media (max-width: 768px) {
  .detail-main {
    flex-direction: column;
  }

  .detail-image {
    width: 100%;
    height: 250px;
  }

  .detail-actions {
    flex-wrap: wrap;
  }
}
</style>
