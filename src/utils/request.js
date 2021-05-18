/*
axios请求模块
*/

import axios from 'axios'

// ^在非组件模块中获取 store ，必须通过单独加载的方式
import store from '@/store'


const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' //! 基础路径
})


// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ^获取需要授权，将Authorization传进来，绑定token
  const {user} = store.state  // 1.解构出user里的token
  // console.log(user)
  // 2.判断如果用户已登录，同意给接口设置token信息
  if(user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器

// 导出
export default request