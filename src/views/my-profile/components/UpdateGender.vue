<template>
<!-- 修改性别组件 -->
<div class="update-gender">
  <!--  -->
    <van-picker
      title="性别"
      show-toolbar
      :default-index="defaultIndex"
      :columns="columns"
      @cancel="$emit('close-popup')"
      @confirm="onConfirm"
      @change="genderChange"
    />

</div>
</template>



<script>
import {updateUserProfile} from '@/api/user'
export default {
  name: 'UpdateGender',
  // 组件参数 接收来自父组件的数据
  props: {
    // 性别
    value: {
      type: Number,
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      columns: ['男', '女'],  //*数组选项
      defaultIndex: this.value,    //*默认选择的项
      currentIndex: '', //*当前选择的项
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
    // &性别改变时触发函数(参数:Picker 实例，选中值，选中值对应的索引)
    genderChange(_, active, index) {
      // console.log(index)
      this.currentIndex = index
    },


    // &点击确定后触发提交更新性别
    async onConfirm() {
      this.$toast.loading({
      message: '修改中...',
      forbidClick: true,
      })

      // 1.请求提交更新昵称
        await updateUserProfile({
          gender: this.currentIndex
        })
        // 2.更新成功后 => 修改父组件中的name => 关闭弹出层
        // 将更新后的数据发送给父组件
        // this.$emit('update-name', this.content)  ||
        this.$emit('input', this.currentIndex)
        this.$emit('close-popup')
        this.$toast.success("修改完成")
    },

    
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>

</style>
