/*
axios请求模块
*/

import axios from 'axios'
import JSONbig from 'json-bigint'

// ^在非组件模块中获取 store ，必须通过单独加载的方式
import store from '@/store'


const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', //! 基础路径

  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用s
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
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