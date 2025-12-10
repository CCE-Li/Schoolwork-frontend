<template>
  <div class="cart-container">
    <!-- 保留的头部搜索区域 -->
    <div class="cart-header">
      <EsHeader></EsHeader>
    </div>

    <!-- 购物车主内容区 -->
    <div class="cart-main">
      <div class="cart-content wrapper">
        <h2 class="cart-title">我的购物车</h2>
        
        <!-- 购物车为空时显示 -->
        <div v-if="cartItems.length === 0" class="cart-empty">
          <el-empty description="购物车为空">
            <el-button type="primary" @click="goToShop">去逛逛</el-button>
          </el-empty>
        </div>

        <!-- 购物车有商品时显示 -->
        <div v-else class="cart-full">
          <!-- 批量操作栏 -->
          <div class="batch-operation-bar">
            <el-checkbox 
              v-model="selectAll" 
              @change="handleSelectAll"
              class="select-all-checkbox"
            >
              全选
            </el-checkbox>
            <div class="operation-buttons">
              <el-button type="info" plain @click="moveToFavorites" :disabled="selectedCount === 0">
                移入收藏
              </el-button>
              <el-button type="danger" plain @click="deleteSelected" :disabled="selectedCount === 0">
                删除
              </el-button>
            </div>
          </div>
          
          <!-- 购物车表格 -->
          <el-table 
            :data="cartItems" 
            class="cart-table"
            :show-header="true"
            style="width: 100%"
            @selection-change="handleItemSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="image" label="商品" width="300">
              <template #default="scope">
                <div class="product-info">
                  <el-image 
                    :src="scope.row.image" 
                    class="product-image" 
                    fit="cover"
                    :preview-src-list="[scope.row.image]"
                    hide-on-click-modal
                  ></el-image>
                  <div class="product-details">
                    <div class="product-name">{{ scope.row.name }}</div>
                    <div class="product-author">{{ scope.row.author }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="price" label="单价" width="150">
              <template #default="scope">
                <span class="price-text">¥{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="quantity" label="数量" width="200">
              <template #default="scope">
                <el-input-number 
                  v-model="scope.row.quantity" 
                  :min="1" 
                  :max="99" 
                  @change="handleQuantityChange(scope.row)"
                  size="small"
                />
              </template>
            </el-table-column>
            
            <el-table-column prop="total" label="小计" width="150">
              <template #default="scope">
                <span class="total-price">¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  :icon="Delete" 
                  circle 
                  @click="removeItem(scope.row.id)"
                  plain
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 结算区域 -->
          <div class="cart-checkout">
            <div class="checkout-summary">
              <span>已选择 {{ selectedCount }} 件商品</span>
              <span class="total-amount">合计: ¥{{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="checkout-buttons">
              <el-button type="primary" size="large" @click="checkout">去结算</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import EsHeader from '@/components/EsHeader.vue'

export default {
  name: 'Cart',
  components: {
    EsHeader,
    Delete
  },
  setup() {
    const router = useRouter()
    
    // 模拟购物车数据
    const cartItems = ref([
      {
        id: 1,
        image: new URL('@/assets/images/goods1.png', import.meta.url).href,
        name: '小幻想家系列丛书(共6册)',
        author: '作者A',
        price: 61.00,
        quantity: 1,
        selected: true
      },
      {
        id: 2,
        image: new URL('@/assets/images/goods2.png', import.meta.url).href,
        name: '"十五五"战略与中国式现代化：新形势、新思路、新举措',
        author: '作者B',
        price: 69.80,
        quantity: 2,
        selected: true
      },
      {
        id: 3,
        image: new URL('@/assets/images/goods3.png', import.meta.url).href,
        name: '台湾百科全书·历史',
        author: '作者C',
        price: 91.00,
        quantity: 1,
        selected: true
      }
    ])

    // 全选状态
    const selectAll = ref(true)

    // 计算选中商品数量
    const selectedCount = computed(() => {
      return cartItems.value.reduce((count, item) => count + (item.selected ? item.quantity : 0), 0)
    })

    // 计算选中的商品种类数
    const selectedVarieties = computed(() => {
      return cartItems.value.filter(item => item.selected).length
    })

    // 全选/取消全选
    const handleSelectAll = (val) => {
      cartItems.value.forEach(item => {
        item.selected = val
      })
    }

    // 监听商品选择状态变化
    const handleItemSelectionChange = (row, checked) => {
      row.selected = checked
      // 更新全选状态
      selectAll.value = cartItems.value.every(item => item.selected)
    }

    // 计算总金额
    const totalAmount = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })

    // 数量变化处理
    const handleQuantityChange = (item) => {
      if (item.quantity < 1) {
        item.quantity = 1
      }
      ElMessage.success('数量已更新')
    }

    // 移入收藏
    const moveToFavorites = () => {
      ElMessage.info(`已将 ${selectedVarieties.value} 个商品移入收藏`)
      // 这里可以添加实际的移入收藏逻辑
    }

    // 删除选中商品
    const deleteSelected = () => {
      ElMessageBox.confirm(
        `确定要删除选中的 ${selectedVarieties.value} 个商品吗？`, 
        '提示', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 过滤掉选中的商品
        cartItems.value = cartItems.value.filter(item => !item.selected)
        ElMessage.success('删除成功')
        
        // 如果没有商品了，重置全选状态
        if (cartItems.value.length === 0) {
          selectAll.value = false
        }
      }).catch(() => {
        // 用户取消删除
      })
    }

    // 删除商品
    const removeItem = (id) => {
      ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = cartItems.value.findIndex(item => item.id === id)
        if (index !== -1) {
          cartItems.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      }).catch(() => {
        // 用户取消删除
      })
    }

    // 结算
    const checkout = () => {
      ElMessage.info('跳转到结算页面')
      router.push('/user/orders')
    }

    // 跳转到商店
    const goToShop = () => {
      router.push('/shop')
    }

    return {
      cartItems,
      selectAll,
      selectedCount,
      totalAmount,
      handleSelectAll,
      handleItemSelectionChange,
      handleQuantityChange,
      removeItem,
      moveToFavorites,
      deleteSelected,
      checkout,
      goToShop,
      Delete
    }
  }
}
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
  padding-bottom: 40px;
}

.cart-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.cart-main {
  padding: 30px 0;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
}

.cart-empty {
  background: #ffffff;
  border-radius: 12px;
  padding: 60px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.cart-full {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.cart-table {
  margin-bottom: 30px;
}

.batch-operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ecf0f1;
  margin-bottom: 20px;
}

.select-all-checkbox {
  margin-right: 15px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
}

.operation-buttons .el-button {
  border-radius: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 5px;
}

.product-author {
  font-size: 14px;
  color: #7f8c8d;
}

.price-text,
.total-price {
  font-size: 16px;
  font-weight: 600;
  color: #3498db;
}

.total-price {
  font-weight: 700;
  color: #e74c3c;
}

.cart-checkout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid #ecf0f1;
}

.checkout-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-summary span {
  font-size: 16px;
  color: #34495e;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.checkout-buttons {
  display: flex;
  gap: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-content {
    padding: 0 15px;
  }
  
  .cart-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .cart-full {
    padding: 15px;
  }
  
  .cart-table :deep(.el-table__cell) {
    padding: 8px 0;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .cart-checkout {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .checkout-summary {
    width: 100%;
  }
  
  .checkout-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .cart-container {
    padding-bottom: 20px;
  }
  
  .cart-main {
    padding: 20px 0;
  }
  
  .cart-title {
    font-size: 22px;
  }
  
  .cart-checkout {
    align-items: center;
  }
  
  .checkout-buttons {
    justify-content: center;
  }
  
  .checkout-summary span {
    font-size: 14px;
  }
  
  .total-amount {
    font-size: 18px;
  }
}
</style>