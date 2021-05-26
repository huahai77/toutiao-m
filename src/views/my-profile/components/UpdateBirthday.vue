<template>
<!-- 修改生日组件 -->
<div class="update-birthday">
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close-popup')"
    @confirm="onConfirm"
  />
</div>
</template>



<script>
import {updateUserProfile} from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  // 组件参数 接收来自父组件的数据
  props: {
    // 生日
    value: {
      type: String,
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      minDate: new Date(1900, 3, 13),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(this.value),   //当前生日
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
    // &点击确定按钮执行提交
    async onConfirm() {
      this.$toast.loading({
      message: '修改中...',
      forbidClick: true,
      })
      
      //格式化日期成接口识别格式
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')   
      // 1.请求获取数据
      await updateUserProfile({
        birthday: date
      })
      // 2.修改成功后，发送事件修改父组件的值
      this.$emit('input', date)
      // 3.关闭弹出层
      this.$emit('close-popup')
      this.$toast.success("修改完成")
    }
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>

</style>
