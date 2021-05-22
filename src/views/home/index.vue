<template>
  <div class="home-container">
    <!-- //!搜索 -->
    <van-nav-bar class="app-nav-bar">
      <van-button 
        class="search-btn" 
        type="info" 
        slot="title" 
        icon="search" 
        size="small" 
        round
        to="/search"
      >搜索
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
        <!-- //^ 文章列表子组件 -->
      </van-tab>

      <!-- 
        //*站位标签，汉堡按钮固定定位把列表最后的位置给挡住了，
        //*解决办法就是在这之间添加站位元素
      -->
      <div slot="nav-right" class="edit-placeholder"></div>

      <!-- //& 编辑频道按钮 -->
      <div slot="nav-right" class="edit-channel-btn" @click="showEditChannel = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>


    <!-- //!编辑频道弹出层 -->
    <van-popup 
      class="edit-popup"
      get-container="body"
      v-model="showEditChannel" 
      position="bottom" 
      closeable
      round
      close-icon-position="top-left"
      :style="{ height: '100%' }" 
    >
    <!-- //^编辑频道内容子组件 -->
    <!-- 
      模板中的 $event 表示事件参数，等价于方法的
      @update-active="updateActive"
      updateActive(index) {
        this.active = index
      }
    -->
    <edit-channel-content 
      :user-channels="channels" 
      :active="active"
      @close-popup="showEditChannel = false"
      @update-active="updateActive"
    />
    <!-- //^编辑频道内容子组件 -->
    </van-popup>

  </div>
</template>


<script>
import {getChannels} from '@/api/user'   //* 导入api接口
import {mapState} from  'vuex'
import {getItem} from '@/utils/storage'

//* 子组件
import ArticleList from './components/ArticleList'
import EditChannelContent from './components/EditChannelContent'


export default {
  name: "home",
  components: {
    ArticleList,
    EditChannelContent
  },

  data() {
    return {
      active: 0,   //& 默认被选中文章频道
      channels: [],   //& 所有频道
      showEditChannel: false,   //& 控制显示编辑频道弹出层
    }
  },

  created() {
    this.loadChannels()   //! 加载频道列表
  },

  methods: {
    //! 加载频道列表
    async loadChannels() {
      // ?请求获取频道数据
      // const {data} = await getChannels()
      // console.log(data)
      //? 将数据列表保存到channels
      // this.channels = data.data.channels  
      // &需要判断用户的状态，
      let channelsData = []
      // ^1.登录：获取线上用户的频道列表
      if(this.user) {
        const {data} = await getChannels()
        channelsData = data.data.channels
      }else{
      // ^2.1未登录：但本地存储有数据，则获取本地的频道列表  
        const localChannels = getItem('user-channels')

        if(localChannels) {
          channelsData = localChannels
        }else {
          // ^2.2未登录：也没有本地存储数据，则获取默认频道数据
          const {data} = await getChannels()
          channelsData = data.data.channels
        }
      }
      //! 将处理好的数据存储到data中已供模板使用
      this.channels = channelsData
    },

    // !更新激活频道
    updateActive(index) {
        this.active = index
      }
  },

  computed: {
    ...mapState(['user'])
  }
}
</script>


<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {  //&搜素
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

  .channel-tabs {   //&文章频道列表
    /deep/ .van-tab {
      border-bottom: 1px solid #edeff3;
      border-right: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
        width: 15px;
        height: 3px;
        background-color: #3296fa;
        bottom: 20px;
    }
    .edit-channel-btn {   //编辑频道按钮
      z-index: 2;
      position: fixed;
      right: 0;
      width: 33px;
      height: 43px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: .9;
      .van-icon-wap-nav {
        font-size: 24px;
      }
      &:before {
        content: '';
        width: 1px;
        height: 29px;
        background: url(./image/gradient.png) no-repeat;
        background-size: fill;
        position: absolute;
        left: 0;
      }
    }
    .edit-placeholder {
      width: 33px;
      flex: 0 0 9%;
    }
  }



}
</style>