<template>
<!-- 评论列表子组件 -->
<div class="comment-list">
  <van-cell title="全部评论" class="title"></van-cell>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <!-- <van-cell 
      v-for="(comment,index) in CommentList" 
      :key="index" 
      :title="comment.content" 
    /> -->
    <!-- //^每项评论子组件 -->
    <comment-item 
      v-for="(comment,index) in commentList" 
      :key="index" 
      :comment="comment"
      @click-reply="$emit('click-reply', $event)"
    />

  </van-list>

</div>
</template>



<script>
import {getComments} from '@/api/comment'
import CommentItem from './CommentItem'

export default {
  name: 'CommentList',
  // 组件参数 接收来自父组件的数据
  props: {
    // *如果获取文章评论，则传递文章ID
    // *如果获取评论回复，则传递评论ID
    source: {   
      type: [Number, String, Object],
      required: true
    },
    type: {
      // *//*评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      type: String,
      default: 'a'
    },
    commentList: {  //*文章评论列表数据
      type: Array,
      default: () => []   //* 数组或对象必须使用函数返回
    }
  },

  // 局部注册的组件
  components: {
    CommentItem
  },

  // 组件状态值
  data () {
    return {
      // commentList: [],   //*评论列表数据
      loading: false,   //*是否处于加载状态
      finished: false,    //*是否已加载完成
      offset: null,     //*下一页数据的页码,不传表示从第一页开始读取数据
      limit: 10     //*每页的数据条数
    }
  },

  // 生命周期函数
  created () {
  },
  mounted () {
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    // &加载评论列表(添加评论或评论回复)
    async onLoad() {
      // 1.请求获取数据
      const {data} = await getComments({
        type: this.type,   //*评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(),   //*源id，文章id或评论id
        offset: this.offset,     //*下一页数据的页码
        limit: this.limit     //*每页的数据条数
      })
      // console.log(data)
      // 2.将数据push保存到列表中
      const {results} = data.data
      // console.log(results)
      this.commentList.push(...results)
      // 该文章评论总数量
      this.$emit('update-total-count', data.data.total_count)
      // 3.将本次的loading状态关闭
      this.loading = false
      // 4.判断是否还有数据
      if(results.length) {
        // 如果有，更新下一页数据的页码,等于下一页页码等于last_id
        this.offset = data.data.last_id
      }else {
        // 如果没有，则将finished设置为true，不在触发加载更多
        this.finished = true
      }
      
      
    },

  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.comment-list {
  .title {
    margin-bottom: 15px;
  }
}
</style>
