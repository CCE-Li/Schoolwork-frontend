import request from '@/utils/request'

// 从购物车创建订单
export function createOrderFromCart(addressId) {
  return request({
    url: '/order/createFromCart',
    method: 'post',
    params: { addressId }
  })
}

// 立即购买创建订单
export function createOrderDirectly(params) {
  return request({
    url: '/order/createDirectly',
    method: 'post',
    params: {
      bid: params.bid,
      number: params.number,
      addressId: params.addressId
    }
  })
}

// 获取订单详情
export function getOrderDetail(orderNo) {
  return request({
    url: `/order/detail/${orderNo}`,
    method: 'get'
  })
}

// 获取用户订单列表
export function getUserOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      status: params.status
    }
  })
}

// 取消订单
export function cancelOrder(orderNo) {
  return request({
    url: `/order/cancel/${orderNo}`,
    method: 'post'
  })
}

// 确认收货
export function confirmReceipt(orderNo) {
  return request({
    url: `/order/confirmReceipt/${orderNo}`,
    method: 'post'
  })
}

// 支付订单
export function payOrder(orderNo, paymentMethod) {
  return request({
    url: `/order/pay/${orderNo}`,
    method: 'post',
    params: { paymentMethod }
  })
}

// 获取订单金额
export function getOrderAmount(orderNo) {
  return request({
    url: `/order/amount/${orderNo}`,
    method: 'get'
  })
}
