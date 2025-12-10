<template>
  <div class="cancel-order-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>取消订单</h1>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="page-main">
      <div class="cancel-container">
        <el-card class="cancel-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon warning"><Warning /></el-icon>
              <span>订单取消确认</span>
            </div>
          </template>
          
          <div class="order-info" v-if="order">
            <div class="info-item">
              <span class="label">订单号：</span>
              <span class="value">{{ order.oid }}</span>
            </div>
            <div class="info-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ formatDate(order.create_time) }}</span>
            </div>
            <div class="info-item">
              <span class="label">订单状态：</span>
              <el-tag :type="getStatusType(order.status)" size="small">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">订单金额：</span>
              <span class="value price">￥{{ calcTotalPrice(order) }}</span>
            </div>
          </div>
          
          <div class="cancel-reason">
            <el-form :model="cancelForm" label-width="100px">
              <el-form-item label="取消原因">
                <el-select v-model="cancelForm.reason" placeholder="请选择取消原因" style="width: 100%">
                  <el-option
                    v-for="item in cancelReasons"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="详细说明">
                <el-input
                  v-model="cancelForm.remark"
                  type="textarea"
                  placeholder="请输入取消订单的详细原因（可选）"
                  :rows="3"
                />
              </el-form-item>
            </el-form>
          </div>
          
          <div class="cancel-actions">
            <el-button @click="goBack">返回</el-button>
            <el-button type="danger" @click="confirmCancel" :loading="cancelLoading">
              确认取消
            </el-button>
          </div>
        </el-card>
        
        <div class="cancel-tips">
          <h3>注意事项</h3>
          <ul>
            <li>订单取消后，相关优惠券将返还到您的账户中</li>
            <li>订单取消后，积分将返还到您的账户中</li>
            <li>已支付的订单将在1-3个工作日内原路退回</li>
            <li>取消订单可能影响您的信用等级</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Warning } from '@element-plus/icons-vue'
import { cancelOrder } from '@/api/order'

const router = useRouter()
const route = useRoute()

// 订单数据
const order = ref(null)
const cancelLoading = ref(false)

// 取消表单
const cancelForm = ref({
  reason: '',
  remark: ''
})

// 取消原因选项
const cancelReasons = [
  { value: 'change_mind', label: '我不想买了' },
  { value: 'wrong_order', label: '信息填写错误，重新拍' },
  { value: 'better_price', label: '找到更便宜的商品' },
  { value: 'delivery_issue', label: '发货太慢' },
  { value: 'other', label: '其他原因' }
]

// 获取订单详情（模拟）
const fetchOrderDetail = () => {
  // 在实际应用中，这里应该通过API获取订单详情
  // 由于目前是模拟数据，我们从路由参数中构建订单信息
  const orderId = route.params.id || route.query.orderId
  order.value = {
    oid: orderId || 'ORD20251210001',
    create_time: new Date().toISOString(),
    status: 0, // 待支付状态才能取消
    books: [
      {
        book_id: 1,
        name: 'Vue.js设计与实现',
        price: 99.00,
        count: 1
      }
    ],
    total_price: 99.00
  }
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
    0: 'warning',
    1: 'primary',
    2: 'info',
    3: 'success',
    4: 'danger'
  }
  return typeMap[status] || 'info'
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 计算订单总价
const calcTotalPrice = (order) => {
  if (order.total_price && order.total_price > 0) {
    return order.total_price.toFixed(2)
  }
  const list = order.books || []
  const total = list.reduce((sum, item) => sum + (item.price || 0) * (item.count || 0), 0)
  return total.toFixed(2)
}

// 确认取消订单
const confirmCancel = async () => {
  if (!cancelForm.value.reason) {
    ElMessage.warning('请选择取消原因')
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要取消该订单吗？取消后无法恢复，请谨慎操作。',
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    cancelLoading.value = true
    
    // 调用取消订单接口
    const res = await cancelOrder(order.value.oid)
    
    if (res.data.code === 200) {
      ElMessage.success('订单已成功取消')
      // 跳转到订单列表页
      setTimeout(() => {
        router.push('/user/orders')
      }, 1500)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败，请稍后重试')
    }
  } finally {
    cancelLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.go(-1)
}

// 初始化
onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.cancel-order-page {
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

/* 主体 */
.page-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.cancel-container {
  max-width: 800px;
  margin: 0 auto;
}

.cancel-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.header-icon {
  margin-right: 8px;
  font-size: 20px;
}

.header-icon.warning {
  color: #e6a23c;
}

.order-info {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  width: 80px;
  color: #666;
  flex-shrink: 0;
}

.value {
  color: #333;
  flex: 1;
}

.value.price {
  color: #f56c6c;
  font-weight: 600;
}

.cancel-reason {
  padding: 20px 0;
}

.cancel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-tips {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.cancel-tips h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.cancel-tips ul {
  padding-left: 20px;
}

.cancel-tips li {
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.cancel-tips li:last-child {
  margin-bottom: 0;
}
</style>