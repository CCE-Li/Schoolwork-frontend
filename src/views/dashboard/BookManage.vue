<template>
  <div class="manage-page">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-lg">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <el-button type="text" @click="goBack" class="mr-4">
            <i class="el-icon-arrow-left text-xl"></i>
          </el-button>
          <h1 class="text-xl font-bold text-gray-800">图书管理</h1>
        </div>
        <div class="flex items-center space-x-4">
          <el-button type="success" @click="showAddDialog">
            <i class="el-icon-plus mr-1"></i>添加图书
          </el-button>
          <el-button type="primary" @click="refreshData">
            <i class="el-icon-refresh mr-1"></i>刷新
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main ref="mainRef" class="flex-1 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <!-- 搜索栏 -->
        <div class="bg-white rounded-xl shadow-md p-4 mb-6">
          <div class="flex flex-wrap gap-4 items-center">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索图书名称/作者"
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

            <!-- 批量操作按钮 -->
            <div class="flex-1"></div>
            <el-button
              type="danger"
              :disabled="selectedBooks.length === 0"
              @click="handleBatchDelete"
            >
              批量删除 ({{ selectedBooks.length }})
            </el-button>
            <el-button
              type="success"
              :disabled="selectedBooks.length === 0"
              @click="handleBatchOnShelf"
            >
              批量上架
            </el-button>
            <el-button
              type="warning"
              :disabled="selectedBooks.length === 0"
              @click="handleBatchOffShelf"
            >
              批量下架
            </el-button>
          </div>
        </div>

        <!-- 图书列表 -->
        <div class="bg-white rounded-xl shadow-md">
          <el-table
            ref="tableRef"
            :data="bookList"
            v-loading="loading"
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="bid" label="图书编号" width="120" />
            <el-table-column prop="coverUrl" label="封面" width="100">
              <template #default="{ row }">
                <el-image
                  :src="row.coverUrl || row.cover_url"
                  style="width: 60px; height: 80px"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-placeholder">暂无</div>
                  </template>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="书名" min-width="180" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }">
                ￥{{ row.price?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="80" />
            <el-table-column prop="sales" label="销量" width="80" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'">
                  {{ row.status === 1 ? '上架' : '下架' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="editBook(row)">
                  编辑
                </el-button>
                <el-button
                  :type="row.status === 1 ? 'warning' : 'success'"
                  size="small"
                  @click="toggleBookStatus(row)"
                >
                  {{ row.status === 1 ? '下架' : '上架' }}
                </el-button>
                <el-button type="info" size="small" @click="editPrice(row)">
                  改价
                </el-button>
                <el-popconfirm
                  title="确定要删除该图书吗？"
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
              :page-sizes="[20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 添加/编辑图书弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑图书' : '添加图书'"
      width="600px"
    >
      <el-form :model="bookForm" label-width="80px">
        <el-form-item label="书名" required>
          <el-input v-model="bookForm.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" required>
          <el-input v-model="bookForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input-number v-model="bookForm.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="bookForm.stock" :min="0" />
        </el-form-item>
        <el-form-item label="封面URL">
          <el-input v-model="bookForm.cover" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="bookForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入图书简介"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBook">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改价格弹窗 -->
    <el-dialog v-model="priceDialogVisible" title="修改价格" width="400px">
      <el-form label-width="80px">
        <el-form-item label="当前价格">
          <span>￥{{ currentBook?.price?.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="新价格">
          <el-input-number v-model="newPrice" :min="0" :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="priceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPrice">确定</el-button>
      </template>
    </el-dialog>
    <!-- 回到顶部按钮 -->
    <el-backtop target=".manage-page > main" :right="40" :bottom="40" :visibility-height="100" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBookList, addBook, updateBook, deleteBook, updateBookStatus, updateBookPrice } from '@/api/admin'

const router = useRouter()

// 数据
const bookList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const dialogVisible = ref(false)
const priceDialogVisible = ref(false)
const isEdit = ref(false)
const currentBook = ref(null)
const newPrice = ref(0)
const selectedBooks = ref([]) // 选中的图书
const tableRef = ref(null) // 表格引用
const mainRef = ref(null) // 主内容区域引用

// 表单
const bookForm = ref({
  title: '',
  author: '',
  price: 0,
  stock: 0,
  cover: '',
  description: ''
})

// 分页
const pagination = ref({
  pageNum: 1,
  pageSize: 20,
  total: 0
})

// 获取图书列表
const fetchBookList = async () => {
  loading.value = true
  try {
    const res = await getBookList({
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      keyword: searchKeyword.value
    })
    if (res.data.code === 200) {
      const data = res.data.data
      // 兼容多种数据格式
      if (Array.isArray(data)) {
        // 直接返回数组，前端分页
        const start = (pagination.value.pageNum - 1) * pagination.value.pageSize
        const end = start + pagination.value.pageSize
        // 如果有搜索关键词，先过滤
        let filtered = data
        if (searchKeyword.value) {
          const kw = searchKeyword.value.toLowerCase()
          filtered = data.filter(book =>
            (book.title && book.title.toLowerCase().includes(kw)) ||
            (book.author && book.author.toLowerCase().includes(kw))
          )
        }
        bookList.value = filtered.slice(start, end)
        pagination.value.total = filtered.length
      } else if (data && data.list) {
        // 分页格式: { list, total }
        bookList.value = data.list
        pagination.value.total = data.total || 0
      } else if (data && data.records) {
        // MyBatis-Plus 格式: { records, total, current, size, pages }
        // 有些后端实现可能仍然把所有记录都放在 records 里，这里再做一层前端分页
        let allRecords = data.records

        // 本地搜索过滤：按标题或作者模糊匹配
        if (searchKeyword.value) {
          const kw = searchKeyword.value.toLowerCase()
          allRecords = allRecords.filter(book =>
            (book.title && book.title.toLowerCase().includes(kw)) ||
            (book.author && book.author.toLowerCase().includes(kw))
          )
        }

        const start = (pagination.value.pageNum - 1) * pagination.value.pageSize
        const end = start + pagination.value.pageSize
        bookList.value = allRecords.slice(start, end)

        // 处理总数：优先使用后端提供的 total，其次使用 pages * size，最后退回 records.length
        if (data.total && data.total > 0) {
          pagination.value.total = data.total
        } else if (data.pages && data.size) {
          pagination.value.total = data.pages * data.size
        } else {
          pagination.value.total = allRecords.length
        }
      } else {
        bookList.value = []
        pagination.value.total = 0
      }
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
    ElMessage.error('获取图书列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.pageNum = 1
  fetchBookList()
}

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = ''
  pagination.value.pageNum = 1
  fetchBookList()
}

// 刷新数据
const refreshData = () => {
  fetchBookList()
}

// 分页变化
const handleSizeChange = () => {
  pagination.value.pageNum = 1
  fetchBookList()
}

const handlePageChange = () => {
  fetchBookList()
}

// 显示添加弹窗
const showAddDialog = () => {
  isEdit.value = false
  bookForm.value = {
    title: '',
    author: '',
    price: 0,
    stock: 0,
    cover: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑图书
const editBook = (row) => {
  isEdit.value = true
  currentBook.value = row
  bookForm.value = { ...row }
  dialogVisible.value = true
}

// 提交图书
const submitBook = async () => {
  if (!bookForm.value.title || !bookForm.value.author) {
    ElMessage.warning('请填写必填项')
    return
  }

  try {
    let res
    if (isEdit.value) {
      res = await updateBook(currentBook.value.id, bookForm.value)
    } else {
      res = await addBook(bookForm.value)
    }

    if (res.data.code === 200) {
      ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
      dialogVisible.value = false
      fetchBookList()
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 切换图书状态
const toggleBookStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    const res = await updateBookStatus(row.id, newStatus)
    if (res.data.code === 200) {
      ElMessage.success(newStatus === 1 ? '已上架' : '已下架')
      fetchBookList()
    }
  } catch (error) {
    console.error('更新状态失败:', error)
  }
}

// 修改价格
const editPrice = (row) => {
  currentBook.value = row
  newPrice.value = row.price
  priceDialogVisible.value = true
}

// 提交价格
const submitPrice = async () => {
  try {
    const res = await updateBookPrice(currentBook.value.id, newPrice.value)
    if (res.data.code === 200) {
      ElMessage.success('价格修改成功')
      priceDialogVisible.value = false
      fetchBookList()
    }
  } catch (error) {
    console.error('修改价格失败:', error)
  }
}

// 删除图书
const handleDelete = async (row) => {
  try {
    const res = await deleteBook(row.id)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      fetchBookList()
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedBooks.value = selection
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedBooks.value.length === 0) {
    ElMessage.warning('请先选择要删除的图书')
    return
  }

  try {
    const promises = selectedBooks.value.map(book => deleteBook(book.id))
    await Promise.all(promises)
    ElMessage.success(`成功删除 ${selectedBooks.value.length} 本图书`)
    selectedBooks.value = []
    fetchBookList()
  } catch (error) {
    console.error('批量删除失败:', error)
    ElMessage.error('部分图书删除失败')
    fetchBookList()
  }
}

// 批量上架
const handleBatchOnShelf = async () => {
  if (selectedBooks.value.length === 0) {
    ElMessage.warning('请先选择要上架的图书')
    return
  }

  try {
    const promises = selectedBooks.value.map(book => updateBookStatus(book.id, 1))
    await Promise.all(promises)
    ElMessage.success(`成功上架 ${selectedBooks.value.length} 本图书`)
    selectedBooks.value = []
    fetchBookList()
  } catch (error) {
    console.error('批量上架失败:', error)
    ElMessage.error('部分图书上架失败')
    fetchBookList()
  }
}

// 批量下架
const handleBatchOffShelf = async () => {
  if (selectedBooks.value.length === 0) {
    ElMessage.warning('请先选择要下架的图书')
    return
  }

  try {
    const promises = selectedBooks.value.map(book => updateBookStatus(book.id, 0))
    await Promise.all(promises)
    ElMessage.success(`成功下架 ${selectedBooks.value.length} 本图书`)
    selectedBooks.value = []
    fetchBookList()
  } catch (error) {
    console.error('批量下架失败:', error)
    ElMessage.error('部分图书下架失败')
    fetchBookList()
  }
}

// 返回上一页
const goBack = () => {
  router.push('/admin/dashboard')
}

onMounted(() => {
  fetchBookList()
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

.image-placeholder {
  width: 60px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 12px;
}
</style>
