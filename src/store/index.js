import Vue from 'vue'
import Vuex from 'vuex'

import {getItem, setItem} from '@/utils/storage'  //导入本地存储封装模块功能

Vue.use(Vuex)


const USER_KEY = 'toutiao-user'   //!声明常量，用于下面使用时导致不必要的变量名字错误

export default new Vuex.Store({
  state: {
    // 当前登录用户的登录状态(token等数据),在接收服务器数据时一般是字符串。我们可以使用 JSON.parse() 方法将数据转换为 JavaScript 对象
    // user: JSON.parse(window.localStorage.getItem('user'))
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止页面刷新数据丢失，我们还需要把数据放在本地存储中，这里仅仅是为了持久化数据， 需要将对象数据转换为JSON格式的字符串
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
