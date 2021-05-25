<template>

<div class="comment-reply">
  <!-- 导航栏 -->
  <van-nav-bar class="nav-bar" :title="`${comment.reply_count}条回复`">
    <van-icon name="cross" slot="left" @click="$emit('close')"/>
  </van-nav-bar>

  <!-- 当前需要评论项 -->
  <div class="comment-item-wrap">
    <comment-item :comment="comment"/>
  </div>



  <!-- 全部回复的列表 -->
  <comment-list 
    class="comment-list" 
    :source="comment.com_id" 
    type="c" 
    :commentList="commentList"
  />


  <!-- //!底部栏 -->
    <div class="footer-wrap">
      <!-- 评论按钮 -->
      <van-button
        class="comment-btn"
        round
        @click="isPostShow = true"
      >
        发布回复
      </van-button>
    </div>

  <!-- //!发布回复弹出层 -->
    <van-popup 
      v-model="isPostShow" 
      position="bottom" 
    >
      <!-- //^组件 -->
      <comment-post 
        :target="comment.com_id" 
        :art_id="art_id" 
        @post-success="onReplySuccess"
      />
    </van-popup>


</div>
</template>



<script>
import CommentItem from './CommentItem'
import CommentList from './CommentList'
import CommentPost from './CommentPost'
export default {
  name: 'CommentReply',
  // 组件参数 接收来自父组件的数据
  props: {
    // 当前回复的评论项
    comment: {
      type: Object,
      required: true
    },
    // 文章ID
    art_id: {
      type: [Number, String, Object],
      required: true
    },
  },

  // 局部注册的组件
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },

  // 组件状态值
  data () {
    return {
      isPostShow: false,    //*控制弹出层的显示与隐藏
      commentList: []   //*评论的回复列表
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
    // &发布回复成功执行函数
    onReplySuccess(comment) {
      // 将最新的回复放到顶部
      this.commentList.unshift(comment)
      // 将回复数量增加
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostShow = false
    }
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.comment-reply {
  .nav-bar {
    position: fixed;
    left: 0;
    right: 0;
  }

  .comment-item-wrap {
    padding: 10px;
    padding-top: 46px;
    border: 1px solid #FDFEFE;
  }

  .title {
    font-size: 16px;
    margin: 10px;
  }
}


// ^底部区域
  /deep/.footer-wrap {
    height: 45px;
    border-top: 2px solid #d8d8d8;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .comment-btn {  //评论按钮
      width: 180px;
      height: 30px;
      border: 1px solid #d8d8d8;
      justify-content: flex-start;
    }
  }

  .comment-list {
    padding: 0 15px;
  }
</style>
