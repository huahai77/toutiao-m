<template>
  <div class="layout-container">
    <!-- 二级子路由出口 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <!-- /子路由出口 -->

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" badge="99+" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" badge="5" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="contact" dot to="/user">我的</van-tabbar-item>
    </van-tabbar>
    <!-- /底部导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'layout',
  data() {
    return {
      active: 0
    }
  },
  mounted () {
    this.$store.commit('addCachePage', 'layout')
  }
}
</script>

<style lang="less" scoped>

</style>