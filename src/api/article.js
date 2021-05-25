/**
 * !!文章相关请求模块
 */


import request from '@/utils/request'


// &获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}


// &获取新闻文章详情
export const getArticleDetails = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}


//&收藏文章
export const collectArticle = targetId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target: targetId    //要收藏文章的Id
    }
  })
}


//&取消收藏文章
export const unCollectArticle = targetId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${targetId}`    //要取消收藏文章的Id
  })
}


// &对文章点赞
export const attitudeArticle = targetId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: targetId     //点赞的文章Id
    }
  })
}


// &取消文章点赞
export const unAttitudeArticle = targetId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${targetId}`    //要取消点赞文章的Id
  })
}
