<template>
<div class="article-container">
  <!-- //!顶部栏 -->
    <!--  $router.back() 返回上一级路由  -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      @click-left="$router.back()"
    >
      <!-- 右侧图标 -->
      <van-icon class="more" slot="right" name="ellipsis" />
    </van-nav-bar>

    <!-- //!中间容器 -->
    <div class="content-wrap">
      <!-- //&标题 -->
      <van-cell center class="article-title" :value="article.title" />

      <!-- //&作者信息 -->
      <van-cell center class="author-info">
        <!-- 头像 -->
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="article.aut_photo"
        />
        <!-- 标题 -->
        <div class="name-wrap">
          <div slot="title" class="name">
            {{article.aut_name}}
          </div>
          <div slot="label" class="time">{{article.pubdate | relativeTime}}</div>
        </div>
        <!-- 右侧关注按钮 -->
        <van-button 
          class="attention-btn"
          slot="right-icon" 
          size="small"
          round 
          :loading="isFollowLoading"
          :icon="article.is_followed ? '' : 'plus'"
          :type="article.is_followed ? 'default' : 'danger'"
          @click="isFollow"
        >
          {{article.is_followed ? '已关注': '关注'}}
        </van-button>
      </van-cell>

      <!-- //&正文内容 -->
      <div 
        class="markdown-body" 
        v-html="article.content"
        ref="article-content"
      >
      </div>

      <van-divider>正文结束</van-divider>

      <!-- //^文章评论列表子组件 -->
      <comment-list 
        :source="articleId" 
        :commentList="commentList" 
        @update-total-count="totalCount = $event"
        @click-reply="onReply"
      />

    </div>
    
    <!-- //!底部栏 -->
    <div class="footer-wrap">
      <!-- 评论按钮 -->
      <van-button
        class="comment-btn"
        round
        @click="isPostShow = true"
      >
        写评论
      </van-button>

      <!-- 收藏 -->
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color= "article.is_collected ? '#FFA500' : '#777'"
        @click="isCollect"
      >
      </van-icon>

      <!-- 总收藏 -->
      <van-icon
        name="comment-o"
        :badge="totalCount"
        color="#777"
      >
      </van-icon>

      <!-- 点赞 -->
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color= "article.attitude === 1 ? '#FFA500' : '#777'"
        @click="isAttitude"
      >
      </van-icon>
      
      <!-- 分享 -->
      <van-icon
        name="share" 
        color="#777"
      >
      </van-icon>
    </div>

    <!-- //!发布评论 -->
    <van-popup 
      v-model="isPostShow" 
      position="bottom" 
    >
      <!-- //^发布评论子组件 -->
      <comment-post :target="articleId" @post-success="postSuccess"/>
    </van-popup>

    <!-- //!回复评论 -->
    <van-popup 
      v-model="isReplyShow" 
      position="bottom" 
      :style="{ height: '80%' }"
    >
      <!-- //^回复评论子组件 -->
      <comment-reply 
        v-if="isReplyShow"
        :comment="currentReply"
        @close="isReplyShow = false"
        :art_id="articleId"
      />
    </van-popup>

</div>
</template>



<script>
import './css/github-markdown.css'
import {
  getArticleDetails, 
  collectArticle, 
  unCollectArticle,
  attitudeArticle,
  unAttitudeArticle
} from '@/api/article'
import {addFollow, cancelFollow} from '@/api/user'

import { ImagePreview } from 'vant'

import CommentList from './components/CommentList'
import CommentPost from './components/CommentPost'
import CommentReply from './components/CommentReply'

// 在组件中获取动态路由参数
// 方法一：this.$route.params.xxx
// 方法二: props传参，推荐使用
export default {
  name: 'Article',
  // 组件参数 接收来自父组件的数据
  props: {
    articleId: {    //动态路由参数,文章id
      type: [String, Number, Object],
      required: true
    }
  },

  // 局部注册的组件
  components: {
    CommentList,
    CommentPost,
    CommentReply
  },

  // 组件状态值
  data () {
    return {
      article: {}, //*文章数据
      commentList: [], //*文章评论列表
      totalCount: 0, //*文章总评论数量
      currentReply: {},   //*当前回复的评论项
      isFollowLoading: false,   //*是否关注的按钮loading状态 
      isPostShow: false,   //*控制发布评论弹出层的显示状态
      isReplyShow: false,   //*控制回复评论弹出层的显示状态
      
    }
  },

  // 生命周期函数
  created () {
    this.loadArticleDetails()
  },
  mounted () {
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    // &加载文章详情
    async loadArticleDetails() {
      const {data} = await getArticleDetails(this.articleId)
      // console.log(data)
      this.article = data.data

      // 数据改变影响试图更新(DOM数据) 不是立即的，如果需要在修改数据后马上操作该被数据影响的试图DOM，需要把这个代码放到 $nextTick中
      this.$nextTick(() => {
        this.handleImagePreview()
      })
      
      // 3.循环img列表，给img注册点击事件
      // 4.在事件处理函数中调用 ImagePreview() 预览
    },

    // &处理图片预览的函数
    handleImagePreview() {
      // 1.获取文章DOM容器
      const articleCount = this.$refs['article-content']
      // console.log(articleCount)
       // 2.得到所有的img标签
      const imgs = articleCount.querySelectorAll('img')
      const imgPaths = []   //定义全部图片的路径
      // 遍历每个img标签
      imgs.forEach((img,index) => {
        imgPaths.push(img.src)   //每遍历一次将img的src路径添加进来
        // 给每个img注册点击事件
        img.onclick = function() {
          ImagePreview({
            images: imgPaths,
            startPosition: index,   //图片起始索引就是哪个图片的index索引
            showIndicators: true,   
            loop: false     //图片不循环播放
          })
        }
      })
      // console.log(imgs)
    
    },

    // &判断是否关注的执行函数
    async isFollow() {
      this.isFollowLoading = true     //当按钮请求按下去，就开始loading
      // 如果已经关注，点击后就是取消关注
      if(this.article.is_followed) {
        await cancelFollow(this.article.aut_id)
        // !下面取反简写了
        // this.article.is_followed = false
      }else {
      // 如果未关注，点击后就是关注
        await addFollow(this.article.aut_id)
        // this.article.is_followed = true
      }
      // 取反一下
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false    //请求完成后关闭loading
    },

    // &判断是否收藏文章的执行函数
    async isCollect() {
      //请求发送后开始提示状态，禁止背景点击
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })

      if(this.article.is_collected) {
        // 如果已收藏，点击后变成未收藏的状态
        await unCollectArticle(this.articleId)
        this.$toast.success("取消收藏")
      }else {
        // 如果未收藏，点击后变成收藏状态
        await collectArticle(this.articleId)
        this.$toast.success("收藏成功")
      }

      this.article.is_collected = !this.article.is_collected
      this.isCollectLoading = false     //请求结束取消loading状态 
    },

    // &判断是否点赞文章的执行函数
    async isAttitude() {
      // 当请求发送后，弹出提示框，并禁用背景点击
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })

      // 如果已经点赞，点击后就变成未点赞状态
      if(this.article.attitude === 1) {
        await unAttitudeArticle(this.articleId)
        this.article.attitude = -1
        this.$toast.success("取消点赞")
      }else {
        // 如果未点赞，点击后就变成点赞状态
        await attitudeArticle(this.articleId)
        this.article.attitude = 1
        this.$toast.success("点赞成功")
      }

    },

    // &发布成功执行函数
    postSuccess(comment) {
      // console.log(comment)
      // 将发布的新信息数据放在顶部
      this.commentList.unshift(comment)
      // 发布完后让评论总数量徽标++
      this.totalCount++
      // 关闭弹出层
      this.isPostShow = false
    },
    
    // &回复评论执行函数
    onReply(comment) {
      console.log('onReply',comment)
      // 将当前回复的评论项保存到data,以便子组件使用
      this.currentReply = comment
      // 
      this.isReplyShow = true
    }

  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>

.article-container {
  /deep/.van-cell {
    background: unset;
    padding: unset;
    line-height: unset;
    &:after {
      border: none;
    }

  }
  //^导航栏区域
  .app-nav-bar {    
  // position: fixed;
  // left: 0;
  // top: 0;
  // width: 100%;
    .more {
      font-size: 20px;
    }
  }
  // ^中间内容区域
  .content-wrap {   
    box-sizing: border-box;
    // padding: 24px 20px 28px 14px;
    // margin-top: 73px;
    padding: 0 20px 0 14px;
    position: fixed;
    left: 0;
    right: 0;
    top: 45px;
    bottom: 45px;
    overflow-y: auto;
    /deep/.article-title {    //&文字标题
      background: unset;
      font-size: 20px;
      font-weight: bold;
      color: #3a3a3a;
      margin: 24px 0 28px;
    }

    .author-info {    //&作者信息
      margin-bottom: 28px;
      .avatar {
        width: 35px;
        height: 35px;
      }
      .name-wrap {
        padding-left: 8px;
        .name {
          font-size: 14px;
        }
        .time {
          color: #d1d1d1;
          font-size: 12px;
        }
      }
      .attention-btn {  //关注按钮
        width: 85px;
        height: 29px;
        .van-button__content { 
          .van-button__text {
            font-size: 14px;
          }
        }
      }
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
      width: 140px;
      height: 30px;
      border: 1px solid #d8d8d8;
      justify-content: flex-start;
    }
  }
}
</style>
