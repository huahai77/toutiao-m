/**
 * 用户相关请求模块
 */

// 导入axios
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