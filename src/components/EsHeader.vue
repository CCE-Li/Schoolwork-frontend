<template>
  <div>
     <div class="search-box">
    <el-input
      v-model="searchText"
      size="large"
      placeholder="搜索购物车内商品"
      clearable
      class="search-input"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-button type="primary">搜索</el-button>
      </template>
    </el-input>
  </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 搜索相关
const searchText = ref('')


export default {}
</script>
