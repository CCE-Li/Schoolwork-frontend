<template>
  <div class="cart-page">
    <div class="cart-header wrapper">
      <div class="logo" @click="goShop">
        <h1><a href="javascript:void(0)">易购图书</a></h1>
      </div>
      <div class="title">购物车</div>
      <div class="actions">
        <el-button type="primary" text @click="goShop">继续逛逛</el-button>
      </div>
    </div>

    <div class="cart-content wrapper">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>我的购物车</span>
            <span v-if="cartItems.length">共 {{ totalCount }} 件商品</span>
          </div>
        </template>

        <el-empty v-if="!loading && !cartItems.length" description="购物车还是空的，去逛逛吧~">
          <el-button type="primary" @click="goShop">去购物</el-button>
        </el-empty>

        <div v-else>
          <div class="cart-table-header">
            <el-checkbox v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
            <span class="col-goods">商品信息</span>
            <span class="col-price">单价</span>
            <span class="col-qty">数量</span>
            <span class="col-subtotal">小计</span>
            <span class="col-op">操作</span>
          </div>

          <el-skeleton :loading="loading" animated :count="3">
            <template #template>
              <div class="cart-row skeleton-row">
                <div class="col-check"><el-skeleton-item variant="circle" /></div>
                <div class="col-goods"><el-skeleton-item variant="image" style="width: 80px; height: 80px; margin-right: 12px;" /><el-skeleton-item style="width: 60%" /></div>
                <div class="col-price"><el-skeleton-item style="width: 40px" /></div>
                <div class="col-qty"><el-skeleton-item style="width: 80px" /></div>
                <div class="col-subtotal"><el-skeleton-item style="width: 60px" /></div>
                <div class="col-op"><el-skeleton-item style="width: 40px" /></div>
              </div>
            </template>

            <template #default>
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="cart-row"
              >
                <div class="col-check">
                  <el-checkbox v-model="item.checked" @change="syncCheckAll" />
                </div>
                <div class="col-goods">
                  <el-image :src="item.image" fit="cover" class="goods-img">
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="goods-info">
                    <div class="goods-title">{{ item.title }}</div>
                    <div class="goods-meta">
                      <span v-if="item.author">作者：{{ item.author }}</span>
                      <span v-if="item.tags" class="tags">{{ item.tags }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-price">￥{{ item.price?.toFixed ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2) }}</div>
                <div class="col-qty">
                  <el-input-number
                    v-model="item.number"
                    :min="1"
                    :max="item.stock || 99"
                    size="small"
                    @change="(val) => handleNumberChange(item, val)"
                  />
                </div>
                <div class="col-subtotal">￥{{ itemSubtotal(item) }}</div>
                <div class="col-op">
                  <el-popconfirm
                    title="确定要删除该商品吗？"
                    confirm-button-text="删除"
                    cancel-button-text="取消"
                    @confirm="handleDelete([item])"
                  >
                    <template #reference>
                      <el-button type="danger" text size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </el-card>

      <div v-if="cartItems.length" class="cart-footer">
        <div class="left">
          <el-checkbox v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
          <el-button type="danger" text @click="handleBatchDelete" :disabled="!hasChecked">批量删除</el-button>
        </div>
        <div class="right">
          <div class="summary">
            已选 <span class="highlight">{{ checkedCount }}</span> 件商品，合计
            <span class="amount">￥{{ totalAmount }}</span>
          </div>
          <el-button type="primary" size="large" :disabled="!hasChecked" @click="handleCheckout">去结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { getCartList, deleteCartItems, updateCartItemNumber } from '@/api/cart'
import { createOrderFromCart } from '@/api/order'

const router = useRouter()

// 这里假设 uid 存在于 localStorage 中
const uid = localStorage.getItem('userId') || localStorage.getItem('uid')

const loading = ref(false)
const cartItems = ref([])
const checkAll = ref(false)

const hasChecked = computed(() => cartItems.value.some(i => i.checked))
const checkedCount = computed(() => cartItems.value.filter(i => i.checked).length)
const totalCount = computed(() => cartItems.value.reduce((sum, i) => sum + Number(i.number || 0), 0))
const totalAmount = computed(() => {
  const sum = cartItems.value
    .filter(i => i.checked)
    .reduce((s, i) => s + Number(i.price || 0) * Number(i.number || 0), 0)
  return sum.toFixed(2)
})

// 将后端返回的购物车数据（{ id, uid, bid, number }）转换为前端使用的结构
const normalizeCartItem = (raw) => {
  return {
    id: raw.id,               // 购物车项ID，用于更新数量
    uid: raw.uid,
    bid: raw.bid,             // 图书ID，用于删除
    title: raw.title,
    number: raw.number,
    image: raw.image,
    price: raw.price,
    author: raw.author,
    tags: raw.tags,
    stock: raw.stock,
    checked: false
  }
}

const loadCart = async () => {
  loading.value = true
  try {
    const res = await getCartList()
    const body = res.data
    let list = []
    // 根据你的后端示例：{ code: 200, message: '成功', data: [ { id, uid, bid, number } ] }
    if (Array.isArray(body?.data)) {
      list = body.data
    } else if (Array.isArray(body)) {
      list = body
    } else if (Array.isArray(body?.data?.list)) {
      list = body.data.list
    }
    cartItems.value = list.map(normalizeCartItem)
  } catch (e) {
    console.error('加载购物车失败:', e)
  } finally {
    loading.value = false
  }
}

const itemSubtotal = (item) => {
  return (Number(item.price || 0) * Number(item.number || 0)).toFixed(2)
}

const handleCheckAll = (val) => {
  cartItems.value.forEach(i => { i.checked = val })
}

const syncCheckAll = () => {
  checkAll.value = cartItems.value.length > 0 && cartItems.value.every(i => i.checked)
}

const handleNumberChange = async (item, val) => {
  const n = Number(val || 1)
  if (!item.id) {
    item.number = n
    return
  }
  try {
    await updateCartItemNumber(item.id, n)
    item.number = n
  } catch (e) {
    console.error('更新数量失败:', e)
    ElMessage.error('更新数量失败')
  }
}

const handleDelete = async (items) => {
  const bids = items.map(i => i.bid).filter(Boolean)
  if (!bids.length) {
    ElMessage.warning('无法删除：缺少图书ID')
    return
  }

  try {
    await deleteCartItems(uid, bids)
    const bidSet = new Set(bids)
    cartItems.value = cartItems.value.filter(i => !bidSet.has(i.bid))
    ElMessage.success('删除成功')
  } catch (e) {
    console.error('删除购物车项失败:', e)
    ElMessage.error('删除失败')
  }
}

const handleBatchDelete = () => {
  const selected = cartItems.value.filter(i => i.checked)
  if (!selected.length) return

  ElMessageBox.confirm(
    `确定要删除选中的 ${selected.length} 件商品吗？`,
    '批量删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    handleDelete(selected)
  }).catch(() => {})
}

const handleCheckout = async () => {
  if (!hasChecked.value) return

  // TODO: 这里先用固定地址ID，后续可接入地址选择
  const addressId = 1

  try {
    const res = await createOrderFromCart(addressId)
    if (res.data && res.data.code === 200) {
      ElMessage.success('结算成功，已生成订单')
      router.push({
        path: '/user/orders',
        query: { newOrder: 1 }
      })
    } else {
      ElMessage.error(res.data?.message || '创建订单失败')
    }
  } catch (e) {
    console.error('从购物车创建订单失败:', e)
    ElMessage.error('创建订单失败，请稍后重试')
  }
}

const goShop = () => {
  router.push('/shop')
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.cart-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 40px 120px;
  box-sizing: border-box;
}

.wrapper {
  width: 100%;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.logo {
  flex-shrink: 0;
  cursor: pointer;
}

.logo a {
  display: block;
  width: 180px;
  height: 40px;
  background-image: url("@/assets/yigou.png");
  background-size: contain;
  background-repeat: no-repeat;
  font-size: 0;
}

.cart-header .title {
  font-size: 22px;
  font-weight: 600;
}

.cart-content {
  margin-top: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.cart-table-header,
.cart-row {
  display: grid;
  grid-template-columns: 60px minmax(260px, 3fr) 120px 150px 120px 100px;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
}

.cart-table-header {
  background-color: #f5f7fa;
  border-radius: 6px;
  color: #888;
}

.cart-row {
  border-bottom: 1px solid #f2f2f2;
}

.cart-row:last-child {
  border-bottom: none;
}

.col-goods {
  display: flex;
  align-items: center;
}

.goods-img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  margin-right: 12px;
  background-color: #f5f7fa;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
}

.goods-info {
  flex: 1;
}

.goods-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.goods-meta {
  font-size: 12px;
  color: #999;
}

.goods-meta .tags {
  margin-left: 12px;
}

.col-price,
.col-qty,
.col-subtotal,
.col-op {
  text-align: center;
}

.col-subtotal {
  color: #e1251b;
  font-weight: 600;
}

.cart-footer {
  margin-top: 16px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cart-footer .summary {
  font-size: 14px;
}

.cart-footer .highlight {
  color: #e1251b;
  font-weight: 600;
  margin: 0 4px;
}

.cart-footer .amount {
  color: #e1251b;
  font-size: 18px;
  font-weight: 700;
  margin-left: 4px;
}

@media (max-width: 1200px) {
  .cart-page {
    padding: 20px;
  }

  .cart-table-header,
  .cart-row {
    grid-template-columns: 40px minmax(200px, 3fr) 100px 140px 100px 80px;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 10px;
  }

  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .cart-table-header,
  .cart-row {
    grid-template-columns: 40px minmax(160px, 2.5fr) 80px 120px 80px 60px;
    padding: 8px 4px;
  }
}
</style>
