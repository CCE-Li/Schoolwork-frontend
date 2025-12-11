import request from '@/utils/request'

// 添加商品到购物车
export function addToCart(data) {
  return request({
    url: '/cart/add',
    method: 'post',
    params: {
      uid: data.uid
    },
    data: {
      bid: data.bid,
      number: data.number
    }
  })
}

// 获取购物车列表
export function getCartList() {
  return request({
    url: '/cart/list',
    method: 'get'
  })
}

// 批量删除购物车项（根据图书ID数组）
export function deleteCartItems(uid, bids) {
  return request({
    url: '/cart/delete',
    method: 'post',
    params: { uid },
    data: bids
  })
}

// 更新购物车商品数量
export function updateCartItemNumber(id, number) {
  return request({
    url: '/cart/update',
    method: 'post',
    data: { id, number }
  })
}
