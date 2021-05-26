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

  
  <!-- 
      //!file头像选择框  设置reef，让点击头像手动调用$refs操作DOM,accept属性可以限制可以选择的类型，
  -->
  <input 
    type="file" 
    hidden 
    ref="file" 
    accept="image/*" 
    @change="imageChange"
  >
  <!-- //&个人资料 -->
  <van-cell-group center class="cell-wrap">
    <!-- 头像 -->
    <van-cell 
      is-link 
      size="large" 
      class="avatar" 
      @click="$refs.file.click()"
    >
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
    <van-cell is-link size="large" @click="isEditNameShow = true">
      <div slot="title">昵称</div>
      <div>{{profile.name}}</div>
    </van-cell>
    <!-- 性别 -->
    <van-cell is-link size="large" @click="isEditGenderShow = true">
      <div slot="title">性别</div>
      <div>{{profile.gender === 1 ? '女' : '男'}}</div>
    </van-cell>
    <!-- 生日 -->
    <van-cell is-link size="large" @click="isEditBirthdayShow = true">
      <div slot="title">生日</div>
      <div>{{profile.birthday}}</div>
    </van-cell>
  </van-cell-group>

  <!-- //&修改名字弹出层区域 -->
  <van-popup 
    class="update-name-wrap"
    v-model="isEditNameShow" 
    position="bottom" 
    :style="{ height: '70%' }"
  >
    <!-- //^更新名字组件 -->
    <!-- 
      当你传递给子组件的数据既要使用又要修改，例如这里的name，这种情况下我们可以使用v-model简写
    -->
    <!-- 
      :name="profile.name"
      @update-name="profile.name = $event"
    -->
    <!--
      v-model="profile.name"
      默认传递一个叫value的数据
      :value="profile.name"
      默认监听input事件 
      @input="profile.name = $event"
      v-model的本质还是父子组件通信，仅仅是简化父组件的使用
      -->
      <!-- 
        弹出层点取消后，组件还在，数据也没有更新，所以应该使用v-if选择性渲染
        当弹出层是true时，渲染组件，第二种方法不摧毁组件更新见UpdateName组件里方法
      -->
    <update-name 
      v-if="isEditNameShow"
      @close-popup="isEditNameShow = false"
      v-model="profile.name"
    />
  </van-popup>

  <!-- //&修改性别弹出层区域 -->
  <van-popup 
    v-model="isEditGenderShow" 
    position="bottom" 
  >
    <!-- //^更新性别子组件 -->
    <update-gender 
      v-if="isEditGenderShow"
      @close-popup="isEditGenderShow = false"
      v-model="profile.gender"
    />
  </van-popup>

  <!-- //&修改生日弹出层区域 -->
  <van-popup 
    v-model="isEditBirthdayShow" 
    position="bottom" 
  >
    <!-- //^更新生日子组件 -->
    <update-birthday 
      v-if="isEditBirthdayShow"
      @close-popup="isEditBirthdayShow = false"
      v-model="profile.birthday"
    />
  </van-popup>

  <!-- //&修改头像弹出层区域 -->
  <van-popup 
    class="avatar-popup"
    v-model="isEditAvatarShow" 
    position="bottom" 
    style="height: 100%"
  >
    <!-- //^更新头像子组件 -->
    <update-avatar 
      v-if="isEditAvatarShow"
      :file="previewImg" 
      @close-popup="isEditAvatarShow = false"
      @update-avatar="profile.photo = $event"
    />
  </van-popup>
</div>
</template>



<script>
import {getUserProfile,getCurrentUser} from '@/api/user'
import UpdateName from './components/UpdateName'
import UpdateGender from './components/UpdateGender'
import UpdateBirthday from './components/UpdateBirthday'
import UpdateAvatar from './components/UpdateAvatar'

export default {
  name: 'profile',
  // 组件参数 接收来自父组件的数据
  props: {},

  // 局部注册的组件
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdateAvatar
  },

  // 组件状态值
  data () {
    return {
      profile: {},    //当前用户资料
      currentUser: {},      //当前用户信息
      currentUserId: '',    //当前用户ID
      isEditNameShow: false, //修改名字的弹出层显示与隐藏
      isEditGenderShow: false,    //修改性别弹出显示与隐藏
      isEditBirthdayShow: false, //修改生日弹出层显示与隐藏
      isEditAvatarShow: false, //修改头像弹出层显示与隐藏
      previewImg: null, //预览图片原始格式路径
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
      // console.log(data.data.id)
    },

    // &加载当前用户个人资料
    async loadUserProfile() {
      const {data} = await getUserProfile(this.currentUserId)
      // console.log(data)
      this.profile = data.data
    },
    
    // &当头像选图发生改变触发
    imageChange() {
      // 1. 打开弹出层
      this.isEditAvatarShow = true
      // 2.弹出层里预览图片
      const file = this.$refs.file.files[0]
      // console.log(file)
      this.previewImg = file  //将路径保存到data中
      // 为了解决原生属性相同文件不触发change事件，这里手动清空file的value选中值
      this.$refs.file.value = ''
    }

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

  .avatar-popup {
    background: #000;
  }
} 
</style>
