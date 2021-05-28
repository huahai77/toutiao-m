<template>
  <div class="not-login-container">
    <div class="avatar" @click="$router.push({
      name: 'login',
      query: {
        redirect: '/user'
      }
    })">
      <img src="./image/not-login-avatar.png" alt=""> 
    </div>
    <div class="login">登录 / 注册</div>
  </div>
</template>

<script>
export default {
  name: 'not-login',
  data() {
    return {
      
    }
  }
}
</script>

<style lang="less" scoped>
.not-login-container {
  height: 180px;
  background: url('./image/banner.png') no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .avatar {
    >img {
      width: 66px;
      height: 66px;
    }
  }
  .login {
    font-size: 14px;
    color: #fff;
  }
}
</style>