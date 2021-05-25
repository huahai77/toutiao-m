<template>
<!-- 评论发布内容组件 -->
<div class="comment-post">
  <van-field
    class="post-text"
    v-model.trim="content"
    rows="2"
    autosize
    type="textarea"
    maxlength="50"
    placeholder="优质评论将会被优先展示"
    show-word-limit
  />
  <van-button 
    size="mini" 
    class="post-btn"
    @click="onPost"
    :disabled="!content"
  >发布
  </van-button>

</div>

</template>



<script>
import {postComment} from '@/api/comment'

export default {
  name: 'CommentPost',
  // 组件参数 接收来自父组件的数据
  props: {
    //评论的目标id,如果是发布文章评论，只需要传文章id
    target: {   
      type: [Number, String, Object],
      required: true
    },
    //如果是评论回复，则要传递上面target评论id和文章id
    art_id: {   
      type: [Number, String, Object],
      default: null
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      content: '',    //*发布评论输入内容
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
    // &发布评论
    async onPost() {
      // 当请求发送后，弹出提示框，并禁用背景点击
      this.$toast.loading({
        message: '发布评论中...',
        forbidClick: true
      })
      // 1.获取接口数据
      const {data} = await postComment({
        target: this.target.toString(),     
        //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id
        content: this.content,    
        //评论内容
        art_id: this.art_id ? this.art_id.toString() : null,     
        //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数,判断一下有需要就传值，不需要就null
      })
      // 2.封装请求方法
      // 3.请求提交数据
      console.log(data)
      // 4.处理响应结果
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success("发布成功")
      // 发布成功清空上一次输入内容
      this.content = ''
    }
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.comment-post {
  display: flex;
  align-items: center;

  /deep/ .post-text {
    padding: 10px !important;
  }
  .post-btn {
    width: 60px;
    margin-right: 10px;
  }
}
</style>
