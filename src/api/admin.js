import request from '@/utils/request'

// ==================== 用户管理 API ====================

// 分页查询用户列表
export function getUserList(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      keyword: params.keyword || ''
    }
  })
}

// 获取用户详情
export function getUserDetail(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'get'
  })
}

// 更新用户状态（启用/禁用）
export function updateUserStatus(id, status) {
  return request({
    url: `/admin/users/${id}/status`,
    method: 'put',
    params: { status }
  })
}

// 更新用户角色
export function updateUserRole(id, status) {
  return request({
    url: `/admin/users/${id}/role`,
    method: 'put',
    params: { status }
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'delete'
  })
}

// 获取用户注册统计
export function getUserRegisterStats(params) {
  return request({
    url: '/admin/users/statistics/register',
    method: 'get',
    params
  })
}

// 获取活跃用户统计
export function getUserActiveStats(params) {
  return request({
    url: '/admin/users/statistics/active',
    method: 'get',
    params
  })
}

// ==================== 图书管理 API ====================

// 分页查询图书列表
export function getBookList(params) {
  return request({
    url: '/admin/books',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      keyword: params.keyword || ''
    }
  })
}

// 获取图书详情
export function getBookDetail(id) {
  return request({
    url: `/admin/books/${id}`,
    method: 'get'
  })
}

// 添加新图书
export function addBook(data) {
  return request({
    url: '/admin/books',
    method: 'post',
    data
  })
}

// 更新图书信息
export function updateBook(id, data) {
  return request({
    url: `/admin/books/${id}`,
    method: 'put',
    data
  })
}

// 删除图书
export function deleteBook(id) {
  return request({
    url: `/admin/books/${id}`,
    method: 'delete'
  })
}

// 更新图书状态（上下架）
export function updateBookStatus(id, status) {
  return request({
    url: `/admin/books/${id}/status/${status}`,
    method: 'put'
  })
}

// 修改图书价格
export function updateBookPrice(id, price) {
  return request({
    url: `/admin/books/${id}/price`,
    method: 'put',
    params: { price }
  })
}

// ==================== 订单管理 API ====================

// 分页查询订单列表
export function getOrderList(params) {
  return request({
    url: '/admin/orders',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      orderNo: params.orderNo || '',
      status: params.status
    }
  })
}

// 获取订单详情
export function getOrderDetail(orderNo, userId) {
  return request({
    url: `/admin/orders/${orderNo}`,
    method: 'get',
    headers: { userId }
  })
}

// 更新订单状态
export function updateOrderStatus(oid, status) {
  return request({
    url: `/admin/orders/${oid}/status/${status}`,
    method: 'put'
  })
}

// 订单发货
export function shipOrder(oid, params) {
  return request({
    url: `/admin/orders/${oid}/ship`,
    method: 'put',
    params
  })
}

// 获取销售统计
export function getSalesStats(params) {
  return request({
    url: '/admin/orders/statistics/sales',
    method: 'get',
    params
  })
}

// 获取每日订单统计
export function getDailyOrderStats(params) {
  return request({
    url: '/admin/orders/statistics/daily',
    method: 'get',
    params
  })
}
