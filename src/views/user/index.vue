<template>
  <div class="user-container">
    <!-- **用户资料块 -->
    <van-cell-group class="user-info" v-if="user">
      <!-- *用户基本信息 -->
      <van-cell class="base-info" center :border="false">
        <!-- 头像 -->
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo" 
        />
        <!-- 昵称 -->
        <div slot="title" class="name">{{currentUser.name}}</div>
        <!-- 编辑资料按钮 -->
        <van-button class="edit-info" round size="small">编辑资料</van-button>
      </van-cell>
      <!-- *用户数据信息 -->
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- **未登录子组件 -->
    <not-login v-else/>
          
    <!-- **收藏与历史块 -->
    <van-grid :column-num="2" class="nav-grid margin-button-4">
      <van-grid-item 
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang" 
        text="收藏"
      >
      </van-grid-item>
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi" 
        text="历史"
      >
      </van-grid-item>
    </van-grid>

    <!-- **小智同学块 -->
    <van-cell title="消息通知" is-link to="" />
    <van-cell title="小智同学" is-link to="" class="margin-button-4"/>

    <!-- **退出登录块 -->
    <van-button v-if="user" @click="logOut" class="log-out" block>退出登录</van-button>
  </div>
</template>

<script>
// ^子组件
import NotLogin from './NotLogin' 

import { mapState } from 'vuex'

// ^api请求
import { getCurrentUser } from '@/api/user'

export default {
  name: 'user',

  components: {
    NotLogin,
  },

  data() {
    return {
      // !当前用户信息
      currentUser: {}
    }
  },

  created() {
    // 加载当前用户信息
    this.loadCurrentUser()
  },

  mounted() {},

  methods: {
    // !退出登录
    logOut() {
      //1. 弹窗提示用户是否确定退出
      //2. 按下确认按钮，退出登录
      this.$dialog.confirm({
        title: '退出确认',
        message: '退出当前头条账号，将不能同步收藏，发布评论和云端分享等',
      }).then(() => {  //? 确定退出执行
          //? 点击了确定，需要把保留的token数据清空，退出用户的登录
          this.$store.commit('setUser', null)

        }).catch(() => {  //? 取消退出执行
          // on cancel
        })
    },

    // !加载当前用户信息
    async loadCurrentUser() {
      const {data} = await getCurrentUser()
      // console.log(data)
      this.currentUser = data.data 
    }
  },

  computed: {
    ...mapState(['user'])
  },

}
</script>

<style lang="less" scoped>
.user-container {
  .user-info {  //? 用户资料块
    background: url('./image/banner.png') no-repeat;
    background-size: cover;
    .base-info {  //? 用户基本信息
      box-sizing: border-box;
      background: unset;
      height: 115px;
      .avatar { //? 头像
        box-sizing: border-box;
        width: 66px;
        height: 66px; 
        border: 1px solid #fff; 
      }
      .name { //? 昵称
        font-size: 15px;
        color: #fff;
        margin-left: 12px;
      }
      .edit-info {  //? 编辑资料
        height: 24px;
        line-height: 24px;
        color: #666666;
      }
    }
    .data-info {  //? 用户数据信息
      .data-info-item {
        height: 65px;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {  //? 数量
          font-size: 18px;
          color: #fff;
          }
          .text { //? 文字
            font-size:11px;
            color: #fff;
          }
        }   
      }
      /deep/.van-grid-item__content {
      background: unset;
      } 
    }
  }
  /deep/.nav-grid {  //? 收藏与历史块
    // margin-bottom: 4px;
    .nav-grid-item {
      height: 70px;
      .toutiao {  //? 两个icon图标
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .log-out {  //? 退出登录
    color: #d86262;
    font-size: 15px;
    font-weight: 700;
  }
  .margin-button-4 {
    margin-bottom: 4px;
  }
}
</style>