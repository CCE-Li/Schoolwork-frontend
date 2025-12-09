import request from '@/utils/request'

// 更新用户基础信息：姓名、邮箱、电话、地址、偏好
// 后端通过认证信息中的 uid 获取当前用户
export function updateUserProfile(data) {
  return request({
    url: '/user/updatelist',
    method: 'post',
    data
  })
}

// 修改用户密码
// payload: { username?, password }
export function updateUserPassword(payload) {
  const { username, password } = payload

  return request({
    url: '/user/update',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 获取当前登录用户的收藏列表
export function getUserFavourites() {
  return request({
    url: '/user/favourites',
    method: 'get'
  })
}

// 添加收藏
export function addFavourite(bid) {
  return request({
    url: `/user/favourites/${bid}`,
    method: 'post'
  })
}

// 取消收藏
export function deleteFavourite(bid) {
  return request({
    url: `/user/favourites/${bid}`,
    method: 'delete'
  })
}
