/**
 * 文章评论相关请求模块
 */

import request from '@/utils/request'


// &获取评论或评论回复
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}


// &对评论或评论回复点赞
export const commentLike = targetId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: targetId      //点赞的评论ID
    }
  })
}


// &取消对评论或评论回复点赞
export const unCommentLike = targetId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${targetId}`     //要取消点赞的评论id或评论回复id
  })
}



// &添加评论或评论回复
export const postComment = data => {
  return request ({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}