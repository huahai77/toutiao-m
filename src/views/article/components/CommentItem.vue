<template>
<van-cell 
  class="comment-item"
>
  <!-- 头像 -->
  <van-image
    slot="icon"
    class="avatar"
    round
    fit="cover"
    :src="comment.aut_photo"
  />

  <!-- 用户名内容 -->
  <div slot="title" class="content-wrap">
    <!-- 名字和点赞行 -->
    <div class="name-wrap">
      <div class="name">{{comment.aut_name}}</div>
      <!-- 右侧点赞 -->
      <div class="like-wrap" @click="onLiking">
        <!-- 点赞 -->
        <van-icon 
          class="like-btn" 
          :class="{isLike: comment.is_liking}"
          :name="comment.is_liking ? 'good-job' : 'good-job-o'" 
        />
        <!-- 点赞数量 -->
        <span class="like-count">{{comment.like_count}}</span>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content">{{comment.content}}</div>
  </div>

  <!-- 时间 -->
  <div slot="label" class="date-wrap">
    <span class="pubdate">{{comment.pubdate | dateTime('MM-DD hh:mm')}}</span>
    <van-button 
      class="reply-btn" 
      round 
      size="mini"
      @click="$emit('click-reply', comment)"
      >
      {{comment.reply_count}}&nbsp;回复
    </van-button>
  </div>


  
</van-cell>
</template>



<script>
import {commentLike, unCommentLike} from '@/api/comment'
export default {
  name: 'CommentItem',
  // 组件参数 接收来自父组件的数据
  props: {
    comment: {    //每项评论的数据
      type: Object,
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {}
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
    // &点赞
    async onLiking() {
      // 请求发送后就进入loading，并且禁用背景点击
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      // 先将id转为字符串
      const targetId = this.comment.com_id.toString()
      // 如果已经点赞，点击后就取消点赞
      if(this.comment.is_liking) {
        await unCommentLike(targetId)
        this.comment.like_count--  
        this.$toast.success("取消点赞")
      }else {
        // 如果没有点赞，点击后就点赞
        await commentLike(targetId)
        this.comment.like_count++
        this.$toast.success("点赞成功")
      }
      // 取反更新视图
      this.comment.is_liking = !this.comment.is_liking
    }
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>

.comment-item {
  padding: 15px 0 !important;
  .avatar {   //&头像
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }

  .content-wrap {   //&内容
    .name-wrap {
      display: flex;
      justify-content: space-between;

      .name {
        color: #607faa;
        font-size: 14px;
      }
      .like-wrap {
        width: 30px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .like-btn {
          &::before {
            font-size: 16px;
          }
        }
        .like-count {
          font-size: 16px;
        }
      }
    }

    .content {
        font-size: 16px;
        margin: 15px 0;
    }
  }

  .date-wrap {  //&底部时间
    display: flex;
    align-items: center;
    .pubdate {
      font-size: 12px;
    }
    .reply-btn {
      margin-left: 12px;
      width: 68px;
      height: 24px;
      background: #eee;
      border: unset;
    }
  }
  .like-btn.isLike {
    color: #FFA500;
  }
}
</style>
