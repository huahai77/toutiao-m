<template>
  <div class="login-container">
    <!-- ***导航栏*** -->
    <!--  $router.back() 返回上一级路由  -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()" />
    <!-- /***导航栏 */ -->

    <!-- ****登录表单*** -->
    <!-- 
      基于 Vant 的表单验证
      1. 使用 vant-form 组件包裹所有的表单项，van-field
      2. 给 vant-form 绑定submit事件
        当表单提交的时候会触发submit事件
        提示：只有在表单验证通过，才调用submit
      3. 使用 Field 的 rules 属性定义校验规则
    -->
    <van-form 
    :show-error="false"
    :show-error-message="false"
    validate-first
    @submit="onLogin" 
    @failed="onFailed"
    ref="formRef"
    >
      <!-- 手机号 -->
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号" 
        name="mobile"
        center
        :rules="formRules.mobile"
        >
      </van-field>  
      <!-- 验证码 -->
      <van-field
        v-model="user.code"
        clearable
        center
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码" 
        name="code"
        :rules="formRules.code">
        <!-- 发送验证码按钮 -->
        <template #button>
          <van-count-down 
          v-if="isShowCountdown"
          :time="1000 * 60" 
          format="ss s" 
          @finish="isShowCountdown = false"/>
          <van-button 
            v-else
            size="small" 
            round 
            class="send-btn" 
            :loading="isShowLoading"
            @click.prevent="onSendSms">
            获取验证码
          </van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button 
          class="login-btn" 
          type="info" 
          block >
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /****登录表单*** -->
  </div>
</template>

<script>
// 引入api
import { login, sendSms } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        mobile: '13622740807', //手机号
        code: '246810'  //验证码
      },
      // 表单的正则验证对象
      formRules: {
        mobile: [ //手机号验证
          {required: true, message:"请输入手机号"},
          {pattern: /^1[3|5|7|8|9]\d{9}$/, message: "手机号格式错误,请输入合法手机号"}
        ],
        code: [ //验证码验证
          {required: true, message:"请输入验证码"},
          {pattern: /^\d{6}$/, message: "验证码错误,请确认后再重试"}
        ]
      },
      // 控制倒计时与发送按钮的切换状态
      isShowCountdown: false,
      // 控制loading加载状态的显示
      isShowLoading: false
    }
  },
  methods: {
    // !验证登录事件
    async onLogin() {
      // 加载提示框
      this.$toast.loading({
        message: '加载中...', //提示文本
        forbidClick: true,  //禁用背景点击
        duration: 0 //展示时长(ms)，值为 0 时，toast 不会消失
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const res = await login(this.user)
        // 4.处理响应结果
        console.log(res)
        this.$toast.success("登录成功~!")
        // 5.登录成功后，将后台返回的登录状态(token等数据)，保存到vuex中
        this.$store.commit('setUser', res.data.data)
        // 6. 登陆成功后，跳转回原来页面
        this.$router.back()
      } catch (err) {
        console.log(err)
        this.$toast.fail("登录失败~!手机号或验证码错误")
      }
    },

    // !验证不通过触发此事件
    onFailed(error) {
      // console.log("验证失败",error)
      // 如果有第一项没有输入，则触发提示
      if(error.errors[0]) {
        this.$toast({message: error.errors[0].message, position: "top"})  //提示错误消息并将消息放在top
      }
    },

    // !获取验证码(自定义，不走官方提供的)
    async onSendSms() {
      // this.$refs['formRef'].validate('mobile').then(data => {
      //   console.log(data)
      // })
      try {
        // 1.首先需要校验手机号
        await this.$refs['formRef'].validate('mobile')
        // 验证通过，先将按钮切换为loading状态，防止用户网速慢点击发送多次请求
        this.isShowLoading = true
        await sendSms(this.user.mobile) // 验证通过后，请求发送验证码
        // 验证码发出去后，隐藏发送按钮，显示倒计时
        this.isShowCountdown = true
      } catch(err) {
        // try 里面的任何代码的错误都会进入catch
        // 不同的错误需要有不同的提示，那就需要判断
        let message = ''
        if(err && err.response && err.response.status === 429) {
          // 发送短信验证码失败的错误提示
          message = "发送太频繁啦,请稍后重试喔"
        }else if(err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        }else {
          // 未知错误
          message = "发送失败,请等下再试试叭"
        }
        // console.dir(err)
        // 提示信息
        this.$toast({message, position: "top"})  //提示错误消息并将消息放在top
      }
      // !不管是发送验证码成功或失败，都需要将loading状态关闭
      this.isShowLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  // 验证码按钮
  .send-btn {
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666;
    }
  }
  // 登录按钮
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6DB4FB;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}


</style>