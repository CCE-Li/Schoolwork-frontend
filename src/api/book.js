import request from '@/utils/request'

// 获取图书列表
export function getBookList(params) {
  return request({
    url: '/books',
    method: 'get',
    params: {
      bid: params?.bid,
      author: params?.author,
      title: params?.title,
      tags: params?.tags
    }
  })
}

// 获取图书详情（包含评论）
export function getBookDetail(bid) {
  return request({
    url: `/books/${bid}`,
    method: 'get'
  })
}

// 添加图书评论
export function addBookComment(bid, data) {
  return request({
    url: `/books/${bid}`,
    method: 'post',
    data: {
      rating: data.rating,
      comment: data.comment
    }
  })
}
