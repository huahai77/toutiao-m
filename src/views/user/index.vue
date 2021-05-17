<template>
  <div class="user">
    <!-- **用户资料块 -->
    <van-cell-group>
      <!-- *用户基本信息 -->
      <van-cell 
        title="单元格" 
        value="内容" 
      >
      <!-- 头像 -->
      <van-image
        slot="icon"
        width="50"
        height="50"
        round
        fit="cover"
        src="https://img01.yzcdn.cn/vant/cat.jpeg" 
      />
      <!-- 昵称 -->
      <div slot="title">昵称</div>
      <!-- 编辑资料按钮 -->
      <van-button round type="info" size="small">编辑资料</van-button>
      </van-cell>
      <!-- *用户数据信息 -->
      <van-grid>
        <van-grid-item>
          <div slot="text">
            <div class="number">1</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item>
          <div class="number">1</div>
          <div class="text">关注</div>
        </van-grid-item>
        <van-grid-item>
          <div class="number">1</div>
          <div class="text">粉丝</div>
        </van-grid-item>
        <van-grid-item>
          <div class="number">1</div>
          <div class="text">获赞</div>
        </van-grid-item>
      </van-grid>

    </van-cell-group>

    <!-- **收藏与历史块 -->
    <van-grid :column-num="2">
      <van-grid-item 
        icon-prefix="toutiao"
        icon="shoucang" 
        text="收藏"
      >
      </van-grid-item>
      <van-grid-item
        icon-prefix="toutiao"
        icon="lishi" 
        text="历史"
      >
      </van-grid-item>
    </van-grid>

    <!-- **小智同学块 -->
    <van-cell title="消息通知" is-link to="" />
    <van-cell title="小智同学" is-link to="" />

    <!-- **退出登录块 -->
    <van-button block>退出登录</van-button>
  </div>
</template>

<script>
export default {
  name: 'user',
}
</script>

<style lang="less" scoped>

</style>