<template>
<!-- !文章列表组件 -->
  <div class="article-list" ref="articleList">
    <!-- //&下拉刷新 -->
    <van-pull-refresh 
      v-model="isRefreshLoading" 
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      :animation-duration="500"
    >
      <!-- //&文章列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 文章列表项子组件 -->
        <article-item v-for="(article,index) in articleList" :key="index" :article="article" 
        />
          
      </van-list>
    </van-pull-refresh>
  </div>
</template>



<script>
import {getArticles} from '@/api/article'   //& api方法

import ArticleItem from '@/components/article-item/ArticleItem'   //& 子组件

import {debounce} from 'lodash'   //&防抖

export default {
  name: "ArticleList",
  // 组件参数 接收来自父组件的数据
  props: {
    // & 频道
    channel: {
      type: Object,
      required: true,
    },
  },

  // 局部注册的组件
  components: {
    ArticleItem,
  },

  // 组件状态值
  data() {
    return {
      articleList: [], //& 文章列表数据
      loading: false, //& 控制本次加载的loading状态
      finished: false,  //& 控制加载结束的状态，不再触发load事件
      timestamp: null,  //& 获取下一页数据的时间戳
      isRefreshLoading: false,  //& 控制下拉刷新loading状态
      refreshSuccessText: '',   //& 刷新成功提示文本
      scrollTop: 0
    }
  },

  // 生命周期函数
  created() {},
  mounted() {
    // 获取滚动距离顶部的位置
    const articleList = this.$refs['articleList']
    articleList.onscroll = debounce(() => {
      // console.log('onscroll')
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  // 被 keep-alive 缓存的组件激活时调用
  activated() {
    // 将记录的到顶部的距离设置回去
    this.$refs['articleList'].scrollTop = this.scrollTop
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    //! 加载列表
    async onLoad() {
      // &1.请求获取列表数据
      const {data} = await getArticles({
        channel_id: this.channel.id,    // 频道id
        timestamp:  this.timestamp || Date.now(),   // 时间戳，相当于页码，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1     // 是否包含置顶
      })
      // console.log(data)

      // &2.将数据放在定义好的list数组中
      // &  注意: 是push进去
      const {results} = data.data   //解构出results省去长串代码
      this.articleList.push(...results)

      // &3.设置本次加载状态结束，它才判断是否加载下一次
      this.loading = false

      // &4.数据全部加载完成
      if(results.length) {    //判断是否还有数据，如果results长度不为空，就说明还有数据
        // & 请求更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      }else {
        // &  没有数据了，数据全部加载完成，不再触发加载更多
        this.finished = true
      }
      
    },

    //! 下拉刷新
    async onRefresh() {
      // &1. 请求获取数据
      const {data} = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      console.log(data)
      // &2. 将数据往列表数据顶部追加
      const {results} = data.data
      this.articleList.unshift(...results)

      // &3. 刷新成功数据，关闭刷新的loading状态
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }

  },
}
</script> 

<style scoped lang='less'>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
