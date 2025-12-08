<template>
  <div class="manage-page">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-lg">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <el-button type="text" @click="goBack" class="mr-4">
            <i class="el-icon-arrow-left text-xl"></i>
          </el-button>
          <h1 class="text-xl font-bold text-gray-800">用户管理</h1>
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
              v-model="searchKeyword"
              placeholder="搜索用户名/邮箱"
              clearable
              style="width: 300px"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <i class="el-icon-search"></i>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </div>
        </div>

        <!-- 用户列表 -->
        <div class="bg-white rounded-xl shadow-md">
          <el-table
            :data="userList"
            v-loading="loading"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="uid" label="用户UID" width="150" />
            <el-table-column prop="username" label="用户名" min-width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                  {{ row.status === 1 ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="viewUser(row)"
                >
                  查看
                </el-button>
                <el-button
                  :type="row.status === 1 ? 'warning' : 'success'"
                  size="small"
                  @click="toggleUserStatus(row)"
                >
                  {{ row.status === 1 ? '禁用' : '启用' }}
                </el-button>
                <el-popconfirm
                  title="确定要删除该用户吗？"
                  @confirm="handleDelete(row)"
                >
                  <template #reference>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
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

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="detailVisible" title="用户详情" width="500px">
      <div v-if="currentUser" class="user-detail">
        <div class="detail-item">
          <span class="label">用户ID：</span>
          <span class="value">{{ currentUser.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户UID：</span>
          <span class="value">{{ currentUser.uid }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户名：</span>
          <span class="value">{{ currentUser.username }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'">
            {{ currentUser.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserList, getUserDetail, updateUserStatus, deleteUser } from '@/api/admin'

const router = useRouter()

// 数据
const userList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const detailVisible = ref(false)
const currentUser = ref(null)

// 分页
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      keyword: searchKeyword.value
    })
    if (res.data.code === 200) {
      const data = res.data.data
      // 兼容两种数据格式：数组或分页对象
      if (Array.isArray(data)) {
        userList.value = data
        pagination.value.total = data.length
      } else {
        userList.value = data.list || data.records || []
        pagination.value.total = data.total || 0
      }
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.pageNum = 1
  fetchUserList()
}

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = ''
  pagination.value.pageNum = 1
  fetchUserList()
}

// 刷新数据
const refreshData = () => {
  fetchUserList()
}

// 分页变化
const handleSizeChange = () => {
  pagination.value.pageNum = 1
  fetchUserList()
}

const handlePageChange = () => {
  fetchUserList()
}

// 查看用户详情
const viewUser = async (row) => {
  try {
    const res = await getUserDetail(row.id)
    if (res.data.code === 200) {
      currentUser.value = res.data.data
      detailVisible.value = true
    }
  } catch {
    // 如果获取详情失败，使用列表数据
    currentUser.value = row
    detailVisible.value = true
  }
}

// 切换用户状态
const toggleUserStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    const res = await updateUserStatus(row.id, newStatus)
    if (res.data.code === 200) {
      ElMessage.success(newStatus === 1 ? '用户已启用' : '用户已禁用')
      fetchUserList()
    }
  } catch (error) {
    console.error('更新用户状态失败:', error)
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    const res = await deleteUser(row.id)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      fetchUserList()
    }
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

// 格式化日期
// const formatDate = (dateStr) => {
//   if (!dateStr) return '-'
//   const date = new Date(dateStr)
//   return date.toLocaleString('zh-CN')
// }

// 返回上一页
const goBack = () => {
  router.push('/admin/dashboard')
}

onMounted(() => {
  fetchUserList()
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

.user-detail {
  padding: 10px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.detail-item .value {
  color: #333;
}
</style>
