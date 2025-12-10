<template>
  <div class="order-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>我的订单</h1>
        </div>
        <div class="header-right">
          <span class="username">{{ currentUsername }}</span>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="page-main">
      <div class="order-container">
        <!-- 订单状态筛选 -->
        <div class="order-tabs">
          <el-tabs v-model="activeStatus" @tab-change="handleTabChange">
            <el-tab-pane label="全部订单" name="all" />
            <el-tab-pane label="待支付" name="0" />
            <el-tab-pane label="已支付" name="1" />
            <el-tab-pane label="已发货" name="2" />
            <el-tab-pane label="已完成" name="3" />
            <el-tab-pane label="已取消" name="4" />
          </el-tabs>
        </div>

        <!-- 订单列表 -->
        <div class="order-list" v-loading="loading">
          <template v-if="orderList.length > 0">
            <div class="order-card" v-for="order in orderList" :key="order.oid">
              <!-- 订单头部 -->
              <div class="order-header">
                <div class="order-info">
                  <span class="order-no">订单号：{{ order.oid }}</span>
                  <span class="order-time">{{ formatDate(order.create_time) }}</span>
                </div>
                <el-tag :type="getStatusType(order.status)" size="small">
                  {{ getStatusText(order.status) }}
                </el-tag>
              </div>

              <!-- 订单商品 -->
              <div class="order-goods">
                <div class="goods-list">
                  <div
                    class="goods-item"
                    v-for="(book, index) in parseBooks(order.books)"
                    :key="index"
                  >
                    <div class="goods-info">
                      <span class="goods-id">ID: {{ book.book_id }}</span>
                      <span class="goods-name">{{ book.name }}</span>
                      <span class="goods-price">￥{{ (book.price || 0).toFixed(2) }}</span>
                      <span class="goods-count">x{{ book.count }}</span>
                      <span class="goods-subtotal">小计：￥{{ ((book.price || 0) * (book.count || 0)).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
                <div class="order-total">
                  <span>共 {{ getTotalCount(order.books) }} 件商品</span>
                  <span class="total-price">
                    合计：<em>￥{{ calcTotalPrice(order) }}</em>
                  </span>
                </div>
              </div>

              <!-- 订单操作 -->
              <div class="order-actions">
                <el-button
                  v-if="order.status === 0"
                  type="danger"
                  @click="handlePay(order)"
                >
                  立即付款
                </el-button>
                <el-button
                  v-if="order.status === 0"
                  @click="goToCancelOrder(order)"
                >
                  取消订单
                </el-button>
                <el-button
                  v-if="order.status === 2"
                  type="primary"
                  @click="handleConfirm(order)"
                >
                  确认收货
                </el-button>
                <el-button @click="viewDetail(order)">
                  查看详情
                </el-button>
              </div>
            </div>
          </template>

          <!-- 空状态 -->
          <el-empty v-else description="暂无订单" />
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="pagination.total > 0">
          <el-pagination
            v-model:current-page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            @size-change="fetchOrderList"
            @current-change="fetchOrderList"
          />
        </div>
      </div>
    </main>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="600px">
      <div class="order-detail" v-if="currentOrder">
        <div class="detail-section">
          <h4>订单信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">订单号：</span>
              <span class="value">{{ currentOrder.oid }}</span>
            </div>
            <div class="detail-item">
              <span class="label">订单状态：</span>
              <el-tag :type="getStatusType(currentOrder.status)" size="small">
                {{ getStatusText(currentOrder.status) }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ formatDate(currentOrder.create_time) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">订单金额：</span>
              <span class="value price">￥{{ calcTotalPrice(currentOrder) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>商品信息</h4>
          <el-table :data="parseBooks(currentOrder.books)" size="small" border>
            <el-table-column prop="book_id" label="图书ID" width="80" />
            <el-table-column prop="name" label="商品名称" min-width="180" />
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">
                ￥{{ (row.price || 0).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量" width="80" align="center" />
            <el-table-column label="小计" width="110">
              <template #default="{ row }">
                <span class="subtotal">￥{{ ((row.price || 0) * (row.count || 0)).toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 支付弹窗 -->
    <el-dialog v-model="payVisible" title="订单支付" width="450px">
      <div class="pay-dialog" v-if="currentOrder">
        <div class="pay-amount">
          <span>支付金额</span>
          <em>￥{{ calcTotalPrice(currentOrder) }}</em>
        </div>
        <div class="pay-methods">
          <h4>选择支付方式</h4>
          <el-radio-group v-model="paymentMethod">
            <el-radio label="alipay" border>
              <span class="pay-option">
                <i class="pay-icon alipay"></i>
                支付宝
              </span>
            </el-radio>
            <el-radio label="wechat" border>
              <span class="pay-option">
                <i class="pay-icon wechat"></i>
                微信支付
              </span>
            </el-radio>
            <el-radio label="balance" border>
              <span class="pay-option">
                <i class="pay-icon balance"></i>
                余额支付
              </span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="payVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmPay">确认支付</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getUserOrderList, cancelOrder, confirmReceipt, payOrder } from '@/api/order'

const router = useRouter()
const route = useRoute()

// 当前用户
const currentUsername = ref(localStorage.getItem('username') || '用户')

// 订单数据
const orderList = ref([])
const loading = ref(false)
const activeStatus = ref('all')

// 分页
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 弹窗
const detailVisible = ref(false)
const payVisible = ref(false)
const currentOrder = ref(null)
const paymentMethod = ref('alipay')

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    }
    if (activeStatus.value !== 'all') {
      params.status = activeStatus.value
    }

    const res = await getUserOrderList(params)
    if (res.data.code === 200) {
      const data = res.data.data
      // 兼容数组或分页对象
      if (Array.isArray(data)) {
        orderList.value = data
        pagination.value.total = data.length
      } else if (data.records) {
        orderList.value = data.records
        pagination.value.total = data.total || data.records.length
      } else {
        orderList.value = []
        pagination.value.total = 0
      }
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换状态标签
const handleTabChange = () => {
  pagination.value.pageNum = 1
  fetchOrderList()
}

// 解析 books JSON
const parseBooks = (books) => {
  if (!books) return []
  try {
    if (typeof books === 'string') {
      return JSON.parse(books)
    }
    if (Array.isArray(books)) {
      return books
    }
    return []
  } catch {
    return []
  }
}

// 获取商品总数
const getTotalCount = (books) => {
  const list = parseBooks(books)
  return list.reduce((sum, item) => sum + (item.count || 0), 0)
}

// 计算订单总价
const calcTotalPrice = (order) => {
  // 如果有 total_price 且大于0，直接使用
  if (order.total_price && order.total_price > 0) {
    return order.total_price.toFixed(2)
  }
  // 否则根据商品计算
  const list = parseBooks(order.books)
  const total = list.reduce((sum, item) => sum + (item.price || 0) * (item.count || 0), 0)
  return total.toFixed(2)
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已发货',
    3: '已完成',
    4: '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',   // 待支付 - 警告色
    1: 'primary',   // 已支付 - 主色
    2: 'info',      // 已发货 - 信息色
    3: 'success',   // 已完成 - 成功色
    4: 'danger'     // 已取消 - 危险色
  }
  return typeMap[status] || 'info'
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 查看详情
const viewDetail = (order) => {
  currentOrder.value = order
  detailVisible.value = true
}

// 立即付款
const handlePay = (order) => {
  currentOrder.value = order
  paymentMethod.value = 'alipay'
  payVisible.value = true
}

// 确认支付
const confirmPay = async () => {
  try {
    const res = await payOrder(currentOrder.value.oid, paymentMethod.value)
    if (res.data.code === 200) {
      ElMessage.success('支付成功')
      payVisible.value = false
      fetchOrderList()
    }
  } catch (error) {
    console.error('支付失败:', error)
  }
}

// 跳转到取消订单页面
const goToCancelOrder = (order) => {
  router.push(`/order/${order.oid}/cancel`)
}

// 确认收货
const handleConfirm = async (order) => {
  try {
    await ElMessageBox.confirm('确认已收到商品？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    const res = await confirmReceipt(order.oid)
    if (res.data.code === 200) {
      ElMessage.success('已确认收货')
      fetchOrderList()
    }
  } catch {
    // 用户取消
  }
}

// 返回
const goBack = () => {
  router.push('/shop')
}

// 初始化
onMounted(() => {
  // 检查是否有新订单参数
  if (route.query.newOrder) {
    activeStatus.value = '0' // 显示待付款订单
    ElMessage.success('订单创建成功，请尽快付款')
  }
  fetchOrderList()
})
</script>

<style scoped>
.order-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  overflow: hidden;
}

/* 头部 */
.page-header {
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.username {
  color: #606266;
  font-size: 14px;
}

/* 主体 */
.page-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.order-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 标签页 */
.order-tabs {
  background: #fff;
  border-radius: 8px;
  padding: 0 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.order-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.order-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  padding: 0 24px;
  height: 50px;
  line-height: 50px;
}

/* 订单列表 */
.order-list {
  min-height: 300px;
}

.order-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.order-no {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.order-time {
  font-size: 13px;
  color: #909399;
}

.order-goods {
  padding: 20px;
}

.goods-list {
  margin-bottom: 16px;
}

.goods-item {
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.goods-id {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.goods-name {
  flex: 1;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.goods-price {
  font-size: 14px;
  color: #606266;
}

.goods-count {
  font-size: 14px;
  color: #909399;
  min-width: 40px;
}

.goods-subtotal {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
  min-width: 100px;
  text-align: right;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.order-total span {
  font-size: 14px;
  color: #606266;
}

.total-price em {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
  font-style: normal;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  background: #fafafa;
  border-top: 1px solid #eee;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 订单详情 */
.order-detail {
  padding: 10px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item .label {
  width: 80px;
  color: #666;
  flex-shrink: 0;
}

.detail-item .value {
  color: #333;
}

.detail-item .value.price {
  color: #f56c6c;
  font-weight: 600;
}

.subtotal {
  color: #f56c6c;
  font-weight: 500;
}

/* 支付弹窗 */
.pay-dialog {
  padding: 10px 0;
}

.pay-amount {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.pay-amount span {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.pay-amount em {
  font-size: 32px;
  font-weight: 600;
  color: #f56c6c;
  font-style: normal;
}

.pay-methods h4 {
  font-size: 14px;
  color: #303133;
  margin-bottom: 16px;
}

.pay-methods :deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pay-methods :deep(.el-radio) {
  margin-right: 0;
  width: 100%;
  height: 50px;
}

.pay-methods :deep(.el-radio__label) {
  width: 100%;
}

.pay-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pay-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.pay-icon.alipay {
  background: #1677ff;
}

.pay-icon.wechat {
  background: #07c160;
}

.pay-icon.balance {
  background: #ff9500;
}
</style>
