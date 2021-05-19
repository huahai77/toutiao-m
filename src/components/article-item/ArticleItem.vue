<template>
<!-- !文章列表项子组件 -->
<!-- 
//* 思路分析
使用vant 组件提供的slot 方法，title定义左侧标题，label定义中间标题下面的内容，这里有两个方案，
1. 右侧一张图片，使用default 定义右侧内容
2. 中间三张图片，把标签放在中间的label里，放在作者描述上方，遍历三张图片动态绑定src
使用v-if判断cover的type等于1或者3，决定显示哪个方案
-->
<van-cell class="article-item">
  <!-- //& 左边: 标题 -->
  <div slot="title" class="title van-multi-ellipsis--l3">{{article.title}}</div>
  <!-- //& 中间: 标题下方内容 -->
  <div slot="label" class="center">
    <!-- //^ 中间三张图方案 -->
    <div class="img-wrap" v-if="article.cover.type === 3">
      <div class="img-wrap-item" 
        v-for="(img,index) in article.cover.images"
        :key="index"
      >
        <van-image class="img-item" fit="cover" :src="img"/>
      </div>
    </div>
    <!-- //^ 作者信息 -->
    <div class="label-wrap">
      <span>{{article.aut_name}}</span>
      <span>{{article.comm_count}}评论</span>
      <span>{{article.pubdate | relativeTime}}</span>
    </div>
  </div>
  <!-- //& 右边: 图片方案 -->
  <van-image
    class="right-img"
    slot="default"
    v-if="article.cover.type === 1"
    fit="cover"
    :src="article.cover.images[0]"
  />

</van-cell>
</template>



<script>
import dayjs from '@/utils/dayjs'
export default {
  name: 'ArticleItem',
  // 组件参数 接收来自父组件的数据
  props: {
    article: {
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

  // 计算属性
  computed: {},

  // 组件方法
  methods: {},

  // 生命周期函数
  created () {
  },
  mounted () {
  },
}
</script> 

<style scoped lang='less'>
.article-item {
  .title {  //& 标题
    font-size: 16px;
    color: #3a3a3a;
  }

  .center {   //& 中间内容
    margin-top: 13px;
    .img-wrap {
      display: flex;
      padding: 15px 0;
      .img-wrap-item {
        flex: 1;
        height: 73px;
        &:not(:last-child) {   //除了最后一个mg-wrap-item
          padding-right: 4px;
        }
        .img-item {
          width: 100%;
          height: 73px;
        }
      }
    }
    .label-wrap {   
      font-size: 11px;
      color: #b4b4b4;
      >span:nth-child(2) {
        margin: 0 12px;
      }
    }
  }

  /deep/ .van-cell__value {   //& 右侧
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
    .right-img {
      width: 116px;
      height: 73px;
    }
  }

}
</style>
