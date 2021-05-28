<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 
      include 只允许设定的组件缓存
    -->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>


  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less" scoped>

</style>