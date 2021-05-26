/**
 * !!用户相关请求模块
 */

// ^导入axios
import request from '@/utils/request'




/** 
 * 用户登录
*/
export const login = data => {
  return request ({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}


/** 
 * 发送验证码
*/
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}


/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // // 获取需要授权，将Authorization传进来，绑定token
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}


/**
 * 获取用户频道列表
 */
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}


/**
 * 关注用户
 */
export const addFollow = targetId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: targetId     //被关注的用户ID
    }
  })
}


/**
 * 取消关注用户
 */
export const cancelFollow = targetId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${targetId}`
  })
}


/**
 * 获取自己当前用户个人资料
 */
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile',
    params: {
      target    //当前自己登录用户ID
    }
  })
}


/**
 * 编辑用户个人资料
 */
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}


/**
 * 编辑用户照片资料
 */
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}