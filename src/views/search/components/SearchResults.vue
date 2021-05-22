<template>
<!-- //!搜索结果 -->
<div class="search-results">
  <van-list
    class="results-list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <van-cell 
      v-for="(result,index) in resultsList" 
      :key="index" 
      :title="result.title" 
    />
  </van-list>
</div>
</template>



<script>
import {getSearchResult} from '@/api/search'

export default {
  name: 'SearchResults',
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
      resultsList: [],   //数据列表
      loading: false,   //加载状态
      finished: false,   //是否全部加载完毕
      page: 1, //默认第一页
      perPage: 10, //默认每页10条

    }
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    // &加载搜索数据列表
    async onLoad() {
      // 1.请求获取数据
      const {data} = await getSearchResult({
        page: this.page,    //页码
        per_page: this.perPage,   //每页数量
        q: this.searchContent   //搜索关键词
      })
      // console.log(data)

      // 2.将数据放到数据列表中
      const {results} = data.data
      this.resultsList.push(...results)

      // 3.关闭本次loading
      this.loading = false

      // 4.判断是否还有数据
      // 如果有，则更新获取下一页数据的页码
      if(results.length) {
        this.page++
      }else {
      // 如果没有。则把finished设置为true，关闭加载更多
      this.finished = true
      }

    }
  },

  // 生命周期函数
  created () {
  },
  mounted () {
  },
}
</script> 

<style scoped lang='less'>
.search-results {
  .results-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
