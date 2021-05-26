<template>
<!-- 修改昵称组件 -->
<div class="update-name">
  <!-- 导航栏 -->
  <van-nav-bar
    class="name-nav-bar"
    title="设置昵称"
    left-text="取消"
    @click-left="onClickLeft"
  >
    <van-button 
      class="name-btn"
      slot="right" 
      size="small"
      type="info"
      :disabled="!content"
      @click="onSuccess"
    >完成
    </van-button>
  </van-nav-bar>

  <!-- 文本框 -->
  <div class="name-text-wrap">
    <van-field 
      class="name-text"
      v-model.trim="content" 
      placeholder="请输入昵称" 
      maxlength="7"
    />
  </div>

</div>
</template>



<script>
import {updateUserProfile} from '@/api/user'
export default {
  name: 'UpdateName',
  // 组件参数 接收来自父组件的数据
  props: {
    // 原来的名字(父组件)
    // name: {
    //   type: String,
    //   required: true
    // }  ||
    value: {
      type: String,
      required: true
    },
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      //*要修改的名称内容,因为父组件传过来的props数据不能直接修改，所有拷贝一份作为修改
      // content: this.name,   || 
      content: this.value,    
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
    // &左侧取消按钮事件
    onClickLeft() {
      // 关闭弹出层
      this.$emit('close-popup')
      // 第二种方法:点击取消后，说明不想修改，重新将没修改的值赋给文本
      this.content = this.value
    },

    // &点击完成修改事件
    async onSuccess() {
      this.$toast.loading({
      message: '修改中...',
      forbidClick: true,
      })

      try {
        // 1.请求提交更新昵称
        await updateUserProfile({
          name: this.content
        })
        // 2.更新成功后 => 修改父组件中的name => 关闭弹出层
        // 将更新后的数据发送给父组件
        // this.$emit('update-name', this.content)  ||
        this.$emit('input', this.content)
        this.$emit('close-popup')
        this.$toast.success("修改完成")
        
      } catch (error) {
        // 如果昵称重复，则捕获异常
        if(error && error.response && error.response.status === 409) {
          this.$toast.fail("昵称已存在")
        }
      }
    }
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.update-name {
  .name-nav-bar {
    /deep/.van-ellipsis {
      color: #666;
      font-size: 18px;
    }
    /deep/.van-nav-bar__text {
      color: #666;
    }
    .name-btn {
      width: 60px;
    //   background-color: #F5F5F5;
      border: none;
    //   /deep/.van-button__text {
    //     color: #666;
    //   }
      }
  }


  .name-text-wrap {
    margin-top: 5px;
  }
}
</style>
