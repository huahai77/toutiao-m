<template>
<!-- 
//!思路：
//1.如果isShowResult为true，则显示搜索结果内容
//2.再如果searchContent有输入内容，则显示联想建议
//3.都不满足否则显示搜索记录
-->
<div class="search-container">
  <!-- //&搜索栏 -->
  <form action="/">
    <van-search
      class="search"
      v-model="searchContent"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch(searchContent)"
      @cancel="$router.back()"
      @focus="isShowResult = false"
    />
  </form>

  <!-- //&搜索结果 -->
  <search-results 
    class="search-results" 
    v-if="isShowResult" 
    :search-content="searchContent"
  />

  <!-- //&联想建议 -->
  <search-advice 
    v-else-if="searchContent" 
    :search-content="searchContent"
    @click-search="onSearch"
  />

  <!-- //&搜索历史 -->
  <search-history 
    v-else 
    :historical-record="historicalRecord"
    @on-search="onSearch"
    @update-history="historicalRecord = $event"
  />

</div>
</template>



<script>
// import {getUserHistory} from '@/api/search'

import SearchAdvice from './components/SearchAdvice'
import SearchHistory from './components/SearchHistory'
import SearchResults from './components/SearchResults'

import {setItem,getItem} from '@/utils/storage'
import {mapState} from 'vuex'

export default {
  name: 'search',
  // 组件参数 接收来自父组件的数据
  props: {},

  // 局部注册的组件
  components: {
    SearchAdvice,
    SearchHistory,
    SearchResults
  },

  // 组件状态值
  data () {
    return {
      searchContent: '',  //*搜索的内容
      isShowResult: false,   //*控制搜索结果的显示状态
      historicalRecord: [],   //*历史记录
    }
  },

  // 计算属性
  computed: {
    ...mapState(['user'])
  },

  // 组件方法
  methods: {
    // &回车或点击搜索触发事件
    onSearch(content) {
      this.searchContent = content    //让搜索的内容变成我点击的内容'

      // 记录搜索历史记录
      const index = this.historicalRecord.indexOf(content)
      if(index !== -1) {
        // 不等于-1 说明有相同的，把重复的删除
        this.historicalRecord.splice(index,1)   //删除当前index，1位
      }

      //将最新的历史添加到上面
      this.historicalRecord.unshift(content)

      // 如果登陆了，则将数据放到线上(后端处理)
      // 如果未登录，将数据存在本地
      setItem('local-history', this.historicalRecord)

      this.isShowResult = true  //按下回车就让搜索结果显示

    },

    // &加载历史记录(因为后端接口问题，这里只加载本地存储数据了)
    async loadHistory() {
      // 因为后台存储的用户历史记录只有4条
      // 所以要将后台存储的历史记录和本地存储的合并
      // 如果用户已登录
      // let historyRes = []   //最终结果
      const lacalHistory = getItem('local-history') || []    //本地历史
      // if(this.user) {
      //   const {data} = await getUserHistory()   //获取用户历史记录
      //   const {keywords} = data.data  //解构
      //   // console.log(keywords)
      //   // 数组去重,先展开合并，然后用[]包裹new set，转成数组，得到最终合并去重的数组
      //   historyRes = [...new Set([...lacalHistory, ...keywords])]
      // }
      // console.log(lacalHistory)
      // console.log(historyRes)
      // &将最终结果赋值给data的historicalRecord展示到模板中
      this.historicalRecord = lacalHistory
    }
  },

  // 生命周期函数
  created () {
    this.loadHistory()
  },
  mounted () {
  },

  // 监视器
  watch: {
    // 监视搜索历史记录的改变
    historicalRecord() {
      setItem('local-history', this.historicalRecord)
    }
  }
}
</script> 

<style scoped lang='less'>
// .search-container {
  // .search {   //搜索栏
  //   // .van-search__action {
  //   //   // color: #fff;
  //   // }
  // }

// }
// /deep/ body {
//   background: #EDEDED;
// }
</style>
