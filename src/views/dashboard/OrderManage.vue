<template>
  <div class="manage-page">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-lg">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <el-button type="text" @click="goBack" class="mr-4">
            <i class="el-icon-arrow-left text-xl"></i>
          </el-button>
          <h1 class="text-xl font-bold text-gray-800">订单管理</h1>
        </div>
        <div class="flex items-center space-x-4">
          <el-button type="primary" @click="refreshData">
            <i class="el-icon-refresh mr-1"></i>刷新
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <!-- 搜索栏 -->
        <div class="bg-white rounded-xl shadow-md p-4 mb-6">
          <div class="flex flex-wrap gap-4 items-center">
            <el-input
              v-model="searchOrderNo"
              placeholder="搜索订单号"
              clearable
              style="width: 250px"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <i class="el-icon-search"></i>
              </template>
            </el-input>
            <el-select v-model="searchStatus" placeholder="订单状态" clearable style="width: 150px">
              <el-option label="待付款" :value="0" />
              <el-option label="待发货" :value="1" />
              <el-option label="已发货" :value="2" />
              <el-option label="已完成" :value="3" />
              <el-option label="已取消" :value="4" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="bg-white rounded-xl shadow-md">
          <el-table
            :data="orderList"
            v-loading="loading"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="oid" label="订单号" width="180" />
            <el-table-column prop="uid" label="用户ID" width="120" />
            <el-table-column prop="total_price" label="订单金额" width="120">
              <template #default="{ row }">
                ￥{{ row.total_price?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="下单时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.create_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="viewOrder(row)">
                  详情
                </el-button>
                <el-button
                  v-if="row.status === 1"
                  type="success"
                  size="small"
                  @click="showShipDialog(row)"
                >
                  发货
                </el-button>
                <el-select
                  v-model="row.newStatus"
                  placeholder="更改状态"
                  size="small"
                  style="width: 110px; margin-left: 8px"
                  @change="changeOrderStatus(row)"
                >
                  <el-option label="待付款" :value="0" />
                  <el-option label="待发货" :value="1" />
                  <el-option label="已发货" :value="2" />
                  <el-option label="已完成" :value="3" />
                  <el-option label="已取消" :value="4" />
                </el-select>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="flex justify-end p-4">
            <el-pagination
              v-model:current-page="pagination.pageNum"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">订单号：</span>
              <span class="value">{{ currentOrder.oid }}</span>
            </div>
            <div class="detail-item">
              <span class="label">用户ID：</span>
              <span class="value">{{ currentOrder.uid }}</span>
            </div>
            <div class="detail-item">
              <span class="label">订单金额：</span>
              <span class="value price">￥{{ currentOrder.total_price?.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">订单状态：</span>
              <el-tag :type="getStatusType(currentOrder.status)">
                {{ getStatusText(currentOrder.status) }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ formatDate(currentOrder.create_time) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>商品信息</h4>
          <div v-if="parsedBooks.length > 0">
            <el-table :data="parsedBooks" size="small" border>
              <el-table-column prop="book_id" label="图书ID" width="80" />
              <el-table-column prop="name" label="商品名称" min-width="180" />
              <el-table-column prop="price" label="单价" width="100">
                <template #default="{ row }">
                  ￥{{ Number(row.price).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="count" label="数量" width="80" align="center" />
              <el-table-column label="小计" width="110">
                <template #default="{ row }">
                  <span style="color: #f56c6c; font-weight: 500;">￥{{ (row.price * row.count).toFixed(2) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else class="empty-data">暂无数据</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 发货弹窗 -->
    <el-dialog v-model="shipDialogVisible" title="订单发货" width="500px">
      <el-form label-width="100px">
        <el-form-item label="订单号">
          <span>{{ currentOrder?.orderNo }}</span>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-input v-model="shipForm.shippingCompany" placeholder="请输入物流公司" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="shipForm.shippingNo" placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShip">确认发货</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderList, getOrderDetail, updateOrderStatus, shipOrder } from '@/api/admin'

const router = useRouter()

// 数据
const orderList = ref([])
const loading = ref(false)
const searchOrderNo = ref('')
const searchStatus = ref('')
const detailVisible = ref(false)
const shipDialogVisible = ref(false)
const currentOrder = ref(null)

// 发货表单
const shipForm = ref({
  shippingCompany: '',
  shippingNo: ''
})

// 解析 books 数据
const parsedBooks = computed(() => {
  if (!currentOrder.value?.books) return []
  try {
    const books = currentOrder.value.books
    // 如果是字符串，解析为 JSON
    if (typeof books === 'string') {
      return JSON.parse(books)
    }
    // 如果已经是数组，直接返回
    if (Array.isArray(books)) {
      return books
    }
    return []
  } catch {
    return []
  }
})

// 分页
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true
  try {
    const res = await getOrderList({
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      orderNo: searchOrderNo.value,
      status: searchStatus.value
    })
    if (res.data.code === 200) {
      const data = res.data.data
      // 兼容两种数据格式：数组或分页对象
      let list = []
      if (Array.isArray(data)) {
        list = data
        pagination.value.total = data.length
      } else {
        list = data.list || data.records || []
        pagination.value.total = data.total || 0
      }
      orderList.value = list.map(item => ({
        ...item,
        newStatus: item.status
      }))
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.pageNum = 1
  fetchOrderList()
}

// 重置搜索
const resetSearch = () => {
  searchOrderNo.value = ''
  searchStatus.value = ''
  pagination.value.pageNum = 1
  fetchOrderList()
}

// 刷新数据
const refreshData = () => {
  fetchOrderList()
}

// 分页变化
const handleSizeChange = () => {
  pagination.value.pageNum = 1
  fetchOrderList()
}

const handlePageChange = () => {
  fetchOrderList()
}

// 查看订单详情
const viewOrder = async (row) => {
  try {
    const res = await getOrderDetail(row.orderNo, row.userId)
    if (res.data.code === 200) {
      currentOrder.value = res.data.data
      detailVisible.value = true
    }
  } catch {
    // 如果获取详情失败，使用列表数据
    currentOrder.value = row
    detailVisible.value = true
  }
}

// 更改订单状态
const changeOrderStatus = async (row) => {
  if (row.newStatus === row.status) return

  try {
    const res = await updateOrderStatus(row.id, row.newStatus)
    if (res.data.code === 200) {
      ElMessage.success('状态更新成功')
      fetchOrderList()
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    row.newStatus = row.status // 恢复原状态
  }
}

// 显示发货弹窗
const showShipDialog = (row) => {
  currentOrder.value = row
  shipForm.value = {
    shippingCompany: '',
    shippingNo: ''
  }
  shipDialogVisible.value = true
}

// 提交发货
const submitShip = async () => {
  try {
    const res = await shipOrder(currentOrder.value.id, shipForm.value)
    if (res.data.code === 200) {
      ElMessage.success('发货成功')
      shipDialogVisible.value = false
      fetchOrderList()
    }
  } catch (error) {
    console.error('发货失败:', error)
  }
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '待付款',
    1: '待发货',
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

// 返回上一页
const goBack = () => {
  router.push('/admin/dashboard')
}

onMounted(() => {
  fetchOrderList()
})
</script>

<style scoped>
.manage-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.manage-page > header {
  flex-shrink: 0;
  width: 100%;
}

.manage-page > main {
  flex: 1;
  overflow-y: auto;
}

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

.books-json {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.books-json pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-data {
  color: #999;
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}
</style>
