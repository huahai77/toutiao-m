import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入Vant组件库
import Vant from 'vant'

// 自动设置rem基准值 (html标签字体大小)
import 'amfe-flexible'

// 导入Vant组件库样式表
import 'vant/lib/index.css'

// !全局样式表(注意点:最好将全局样式放在最后，因为后者覆盖前者，能更好的替换第三方样式!!)
import './styles/index.less'

// 全局注册Vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
