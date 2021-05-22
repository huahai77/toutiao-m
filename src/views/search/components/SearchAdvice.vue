<template>
<!-- //!联想建议 -->
<div class="search-advice">
  <van-cell 
    icon="search" 
    v-for="(advice,index) in adviceList"
    :key="index"
    @click="$emit('click-search', advice)"
  >
    <div slot="title" v-html="highLight(advice)"></div>
  </van-cell>
</div>
</template>



<script>
import {getSearchAdvice} from '@/api/search'

import {debounce} from 'lodash' //防抖工具函数

export default {
  name: 'SearchAdvice',
  // 组件参数 接收来自父组件的数据
  props: {
    searchContent: {  //搜索的内容
      type: String,
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      adviceList: [],   //联想数据列表
    }
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    //& 高亮搜索关键词
    highLight(advice) {
      // console.log(advice)
      // 错误的写法：/this.searchContent/gi，正则表达式/中间的内容/都会被当做正则匹配模式字符来对待
      // 格式：要替换的正则表达式(匹配模式)，第二个要替换的字符
      // RegExp 是正则表达式的构造函数
      // 参数一: 要替换的字符串
      // 参数二: 匹配模式
      // 返回值：正则对象
      let reg = new RegExp(this.searchContent, 'gi')
      let str = `<span style="color: red">${this.searchContent}</span>`
      return advice.replace(reg, str)
    }
  },

  // 生命周期函数
  created () {
  },
  mounted () {
  },

  // 监视器
  watch: {
    //*tips:属性名是需要监视的数据名称，不能乱写
    // searchContent() {
    //   console.log('hello')
    // }
    // 完整写法
    searchContent: {
      // 当数据发生变化会执行handler处理函数
      handler: debounce(async function() {  //防抖
        const {data} = await getSearchAdvice(this.searchContent)
        // console.log(data)
        const {options} = data.data
        this.adviceList = options  
      },300),
      // async handler() {
      //   //1. 找到数据接口
      //   //2. 请求获取数据
      //   //3. 模板绑定展示
        // const {data} = await getSearchAdvice(this.searchContent)
        // console.log(data)
        // const {options} = data.data
        // this.adviceList = options    
        immediate: true   // 该回调将会在侦听开始之后被立即调用
      }

    }
  }

</script> 

<style scoped lang='less'>

</style>
