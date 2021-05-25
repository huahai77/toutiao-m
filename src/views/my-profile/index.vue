<template>
<!-- 我的资料 -->
<div class="user-profile">
  <!-- //&导航栏 -->
  <van-nav-bar
    class="pro-nav-bar"
    title="个人信息"
    left-arrow
    @click-left="$router.back()"
  />

  <!-- //&资料 -->
  <van-cell-group center class="cell-wrap">
    <!-- 头像 -->
    <van-cell is-link size="large" class="avatar">
      <div slot="title">头像</div>
      <van-image
        class="avatar-img"
        round
        width="30px"
        height="30px"
        fit="cover"
        :src="profile.photo"
      />
    </van-cell>
    <!-- 昵称 -->
    <van-cell is-link size="large" @click="isNameShow = true">
      <div slot="title">昵称</div>
      <div>{{profile.name}}</div>
    </van-cell>
    <!-- 性别 -->
    <van-cell is-link size="large">
      <div slot="title">性别</div>
      <div>{{profile.gender === 1 ? '女' : '男'}}</div>
    </van-cell>
    <!-- 生日 -->
    <van-cell is-link size="large">
      <div slot="title">生日</div>
      <div>{{profile.birthday}}</div>
    </van-cell>
  </van-cell-group>

  <!-- //&修改名字弹出层区域 -->
  <van-popup 
    class="update-name-wrap"
    v-model="isNameShow" 
    position="bottom" 
    :style="{ height: '70%' }"
  >
    <!-- //^更新名字组件 -->
    <update-name 
    @close-popup="isNameShow = false"
    :name="profile.name"
    @update-name="profile.name = $event"
    />
  </van-popup>
</div>
</template>



<script>
import {getUserProfile,getCurrentUser} from '@/api/user'
import UpdateName from './components/UpdateName'

export default {
  name: 'profile',
  // 组件参数 接收来自父组件的数据
  props: {},

  // 局部注册的组件
  components: {
    UpdateName
  },

  // 组件状态值
  data () {
    return {
      profile: {},    //当前用户资料
      currentUser: {},      //当前用户信息
      currentUserId: '',    //当前用户ID
      isNameShow: false, //修改名字的弹出层控制项
    }
  },

  // 生命周期函数
  created () {
    this.loadCurrentUser()
    this.loadUserProfile()
  },
  mounted () {
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    // !加载当前用户信息
    async loadCurrentUser() {
      const {data} = await getCurrentUser()
      // console.log(data)
      this.currentUser = data.data
      // 将用户ID保存到data
      this.currentUserId = data.data.id.toString() 
      console.log(data.data.id)
    },

    // &加载当前用户个人资料
    async loadUserProfile() {
      const {data} = await getUserProfile(this.currentUserId)
      console.log(data)
      this.profile = data.data
    },
    

  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.user-profile {
  .pro-nav-bar {
    background: #3196FA;
    /deep/.van-nav-bar__arrow {
      color: #fff;
    }
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }

  .cell-wrap {
    .avatar {   //头像
      display: flex; 
      align-items: center;
      .van-cell__value {  //头像图片
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }

  .update-name-wrap {
    background-color: #F5F7F9;
  }
} 
</style>
