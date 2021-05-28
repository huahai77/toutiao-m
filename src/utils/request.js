/*
axios请求模块
*/

import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'

// ^在非组件模块中获取 store ，必须通过单独加载的方式
import store from '@/store'

import router from '@/router'


// 创建多一个实例，刷新token使用这个，为了不和下面带有拦截器和判断的实例混淆
const refreshToken = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', //! 基础路径
})


// 请求实例
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
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 对响应错误做点什么
  // 超过2xx的状态码都会进入这里
  // console.dir(error)
  const status = error.response.status
  if(status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数错误')
  }else if(status === 401) {
    // token 无效
    // 如果没有user或者user.token 说明没有登录直接就跳转到登录界面
    const {user} = store.state
    if(!user || !user.token) {
      // 直接跳转到登录页
      return redirectLogin()
    }

    // 使用refresh_token 请求获取新的token
    try {
      const { data } = await refreshToken({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // console.log(data)
      // 将拿到最新的token更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)

    } catch (error) {
      // ?刷新token都失败了，那还想什么，你号没了(重新登录去)
      redirectLogin()
    }
    // 把失败的请求重新发出去
    // error.config 是本次请求的相关配置信息对象
    // 这里使用request 发请求，它会走自己的拦截器
    // 它的请求拦截器中通过 store容器访问token数据
    return request(error.config)

  }else if(status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  }else if(status === 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }

  return Promise.reject(error)
})


// &重新登录方法(直接跳转替换到login页面)
// 1.router.currentRoute: 当前的路由信息对象，我们可以通过router.currentRoute.fullPath获得解析后的 URL，包含查询参数和 hash 的完整路径，如果要访问的页面的路由有命名（name）的话，可以通过router.currentRoute.name获得当前路由的名称。

// 2.router.replace：作用和router.push相同，不过它不会向history添加新纪录，而是替换当前的history记录。
function redirectLogin() {
  // router.replace('/login')
  router.replace({
    name: 'login',
    // 传递查询参数，查询参数会以?作为分隔符放到url后面
    query: {
      // 数据名是自己起的
      // router.currentRoute和我们在组件中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })

}

// 导出
export default request