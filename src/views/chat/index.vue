<template>
<div class="chat-wrap">
  <!-- //&导航栏 -->
  <van-nav-bar
    class="chat-nav-bar"
    title="小U同学"
    left-arrow
    @click-left="$router.back()"
  />

  <!-- //&消息内容 -->
  <van-cell-group class="chat-message-wrap">
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
    <van-cell value="内容" />
  </van-cell-group>

  <!-- //&底部栏 -->
  <van-cell-group class="chat-send-wrap">
    <van-field v-model="message" :border="false"/>
    <van-button type="primary" size="small">发送</van-button>
  </van-cell-group>
</div>
</template>



<script>


// 发送消息
// socket.emit('消息类型',消息内容)
// socket.on('消息类型',function(data) {
    // data消息
// })

export default {
  name: '',
  // 组件参数 接收来自父组件的数据
  props: {},

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      message: '',    //*输入的消息
    }
  },

  // 生命周期函数
  created () {
  //   // 建立连接
  //   const socket = io('http://ttapi.research.itcast.cn')

  //   socket.on('connect', function() {
  //     console.log('连接建立成功')
  //   })

  //   socket.on('disconnect', function() {
  //     console.log('断开连接')
  //   })
  },
  mounted () {
    
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {},

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.chat-wrap {
  .chat-nav-bar {
    background: #3196FA;
    /deep/.van-nav-bar__arrow {
      color: #fff;
    }
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }

  .chat-message-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 50px;
    overflow-y: auto;
  }

  .chat-send-wrap {
    height: 50px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 12px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    .van-button--small {
      width: 70px;
    }
  }
}
</style>
