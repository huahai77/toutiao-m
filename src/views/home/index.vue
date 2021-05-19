<template>
  <div class="home-container">
    <!-- //!导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button 
        class="search-btn" 
        type="info" 
        slot="title" 
        icon="search" 
        size="small" 
        round>搜索
      </van-button>
    </van-nav-bar>


    <!-- //!文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active">
      <!-- //& 频道标题 -->
      <van-tab 
        :title="channel.name" 
        v-for="channel in channels" 
        :key="channel.id"
        >
        <!-- //^ 文章列表子组件 -->
        <!-- 
          父组件把channel频道数据通过prop传递给子组件的foo,
          为什么标签内容是懒渲染的？
          因为这是 Tab 标签页组件本身支持的默认功能，如果不需要可以通过配置 :lazy-render="false" 来关闭这个效果。 
        -->
        <article-list :channel="channel" />

      </van-tab>
    </van-tabs>

  </div>
</template>


<script>
import ArticleList from './components/ArticleList'  //* 子组件
import {getChannels} from '@/api/user'   //* 导入api接口

export default {
  name: "home",
  components: {
    ArticleList,
  },

  data() {
    return {
      active: 0,   //& 默认被选中文章频道
      channels: [],   //& 所有频道
    }
  },

  created() {
    this.loadChannels()   //! 加载频道列表
  },

  methods: {
    //! 加载频道列表
    async loadChannels() {
      // ?请求获取频道数据
      const {data} = await getChannels()
      // console.log(data)
      //? 将数据列表保存到channels
      this.channels = data.data.channels  
    }
  },

}
</script>


<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {  //搜素
    max-width: unset;
    .search-btn {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-icon-search {
        font-size: 16px;
      }
      .van-button__text {
        font-size: 14px;
      }
    }
  }

  .channel-tabs {   //频道tab列表
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
        width: 15px;
        height: 3px;
        background-color: #3296fa;
        bottom: 20px;
    }
  }
}
</style>