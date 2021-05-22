<template>
<!-- //!搜索历史 -->
<div class="search-history">
  <!-- //&标题 -->
  <!-- 
    注意：这里想删除父组件传过来的prop数据，不能直接在这里操作，需要发送自定义事件让父组件自己删除
  -->
  <van-cell title="搜索历史">
    <!-- //1.显示文字 -->
    <div v-if="isDelete">
      <span @click="$emit('update-history', [])">全部删除</span>
      &nbsp;&nbsp;
      <span @click="isDelete = false">完成</span>
    </div>
    <!-- //2.显示删除图标 -->
    <van-icon name="delete-o" v-else @click="isDelete = true" />
    
  </van-cell>

  <!-- //&记录列表 -->
  <van-cell 
    v-for="(history,index) in historicalRecord" 
    :key="index" 
    :title="history"
    @click="onSearch(history)"
  > 
    <!-- 单个的删除图标 -->
    <van-icon name="close" v-show="isDelete" @click="onDelete(index)"/>
  </van-cell>
</div>
</template>



<script>
// import {setItem} from '@/utils/storage'

export default {
  name: 'SearchHistory',
  // 组件参数 接收来自父组件的数据
  props: {
    historicalRecord: {   //历史记录
      type: Array,
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      isDelete: false,   //控制删除状态的显示
    }
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    // &删除点击的单个历史记录
    onDelete(index) {
      // *如果是删除状态，才执行删除操作
      if(this.isDelete) {
        this.historicalRecord.splice(index, 1)
        // *数据持久化(在父组件watch已经做了监听处理)
        // 修改本地存储的数据
        // setItem('local-history', this.historicalRecord)
        // return
      }
    },

    // &展示点击的历史记录搜索结果
    onSearch(history) {
      // *非删除状态，点击某个历史进行搜索
      if(!this.isDelete) {
        this.$emit('on-search', history)
      }
    },

  },

  // 生命周期函数
  created () {
  },
  mounted () {
  },
}
</script> 

<style scoped lang='less'>

</style>
