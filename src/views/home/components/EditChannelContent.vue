<template>
<div class="edit-channel-content">
  <!-- //&我的频道与编辑标题 -->
  <van-cell 
  center 
  class="my-channel" 
  :border="false"
  >
    <div slot="title" class="title">我的频道</div>
    <van-button 
      class="edit-btn" 
      slot="default" 
      plain 
      round 
      type="danger"
      @click="isEdit = !isEdit"
    >
    {{isEdit ? '完成' : '编辑'}}
    </van-button>
  </van-cell>

  <!-- //我的频道宫格 -->
  <van-grid :gutter="10">
    <van-grid-item 
      class="grid-item"
      :class="{active: index === active}"
      v-for="(channel,index) in userChannels" 
      :key="index"  
      :text="channel.name" 
      :icon="(isEdit && index !== 0) ? 'clear' : ''"
      @click="onUserChangeClick(channel,index)"
    />
  </van-grid>

  <!-- //&频道推荐 -->
  <van-cell 
    center 
    class="channel-recommend" 
    :border="false"
  >
    <div slot="title" class="title">频道推荐</div>
  </van-cell>
  <van-grid :gutter="10">
    <van-grid-item 
      class="grid-item"
      v-for="(channel,index) in recommendedChannels" 
      :key="index"  
      :text="channel.name" 
      @click="addChannel(channel)"
    />
  </van-grid>
</div>
</template>



<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channel'  //网络请求方法

import {mapState} from 'vuex'
import {setItem} from '@/utils/storage'


export default {
  name: 'EditChannelContent',
  // 组件参数 接收来自父组件的数据
  props: {
    userChannels: {   //父组件传递的用户频道列表
      type: Array,
      required: true
    },
    active: {
      type: Number,  //激活的频道
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      allChannels: [],   //& 所有频道列表
      isEdit: false,    //& 控制编辑的显示状态
    }
  },

  // 计算属性
  computed: {
    ...mapState(['user']),

    // &计算推荐频道
    // &计算属性会观测内部依赖数据的变化二重新求值
    recommendedChannels() {
      // ^思路：所有频道(all) - 用户频道(userChannels) = 剩余推荐频道
      // filter 方法：过滤数据，根据方法返回的布尔值true来收集数据
      // filter 方法查找满足条件的所有元素
      return this.allChannels.filter(allChannel => {
        // 判断channel是否存在用户频道
        // find 方法查找满足条件的单个元素
        // 找到用户频道与所有频道id不相等的
        return !this.userChannels.find(userChannel => {
          return userChannel.id === allChannel.id
        })
      })

      // 2.原生for写法
      // const res = []
      // // ^遍历所有频道
      // this.allChannels.forEach(allChannel => {
      //   let flag = false
      //   // ^遍历用户频道
      //   for(let i = 0; i < this.userChannels.length; i++) {
      //     if(this.userChannels[i].id === allChannel.id) {
      //       flag = true    //用户频道存在所有频道的数据
      //       break
      //     }
      //   }
      //   if(!flag) {   //将存在所有频道的数据取反保存
      //     res.push(allChannel)
      //   }
      // })
      // return res
    }
  },

  // 组件方法
  methods: {
    // &加载所有频道列表
    async loadAllChannels() {
      const {data} = await getAllChannels()
      // console.log(data)
      const {channels} = data.data  //解构
      this.allChannels = channels
    },

    // &添加频道
    async addChannel(channel) {
      this.userChannels.push(channel)

      // !数据持久化
      if(this.user) {
        // 用户登陆了，数据存储在线上
        await addUserChannels({
          channels: [ //用户关注的频道列表
          //频道id和顺序序号,序号就是用户频道的个数，从1开始,就是他的长度
            {id: channel.id, seq: this.userChannels.length}  
          ]
        })
      }else {
        // 用户未登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },




    //& 双状态方法
    onUserChangeClick(channel,index) {   
      if(this.isEdit && index !== 0) {
        // ^编辑状态，删除当前频道并且推荐不需要删除
        this.deleteChannel(channel,index)
        
      }else {
        // ^非编辑状态，切换至当前频道
        this.switchChannel(index)
      } 
    },
    // &编辑状态删除方法
    async deleteChannel(channel,index) {
      // 如果删除的是激活项前面的频道
      if(index <= this.active) {
        // 更新激活频道的索引，让当前激活索引-1
        this.$emit('update-active', this.active - 1)    
      }
      this.userChannels.splice(index, 1)    //从当前索引号删除一个，就是删除当前

      // 数据持久化
      if(this.user) {
        // 如果登陆了，数据存储到线上
        await deleteUserChannels(channel.id)
      }else{
        // 如果未登录，数据存储在本地
      }
    },
    // &非编辑状态切换方法
    switchChannel(index) {
      // 切换对应频道
      this.$emit('update-active', index)
      // 关闭弹出层
      this.$emit('close-popup')
    }
  },

  // 生命周期函数
  created () {
    this.loadAllChannels()
  },
  mounted () {
  },
}
</script> 

<style scoped lang='less'>
.edit-channel-content {
  padding-top: 54px;
  .van-cell {   //! cell公共样式
    margin-bottom: 24px;
    .title {
      font-size: 16px;
    }
  }

  .my-channel {   //& 我的频道与编辑
    .edit-btn {   
      height: 24px;
      // color: #f85959;
    //   position: absolute;
    //   right: 0;
    //   top: 0;
    }
  }

  .channel-recommend {
    margin-top: 37px;
  }

  .van-grid {   //!宫格公共样式
    .grid-item {  
      // padding-bottom: 14px;
      height: 43px;
      /deep/ .van-grid-item__content { 
        background-color: #f4f5f6;
        border-radius: 5px;
        >.van-grid-item__text {
          color: #222;
          font-size: 12px;
          margin-top: 0;
        }
        &:after {
          border: unset;
        }
        .van-grid-item__icon {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 16px;
          color: #ccc;
        }
      }
    }
  }



  .active {
    /deep/.van-grid-item__text {
      color: #f85a5a !important;
    }
  }



}
</style>
