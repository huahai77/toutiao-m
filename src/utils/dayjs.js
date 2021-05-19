/**
 * !初始化 dayjs 相关配置
 */

import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间
dayjs.extend(relativeTime)

// 配置使用中文包
dayjs.locale('zh-cn') 


// 将处理相对时间的代码包装为全局过滤器
// 然后就可以在任何组件的模板中使用
// 所谓的过滤器其实就是一个可以在模板中调用的函数而已
// 在组件的模板中使用过滤器：{{xxx | relativeTime}}
// 管道符前面的内容会作为参数传递给过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})






// console.log(dayjs().to(dayjs('2020-2-2')))
// console.log(dayjs().toNow())
