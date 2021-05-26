<template>
<!-- 修改头像组件 -->
<div class="update-avatar">
  <!-- 头像图片 -->
  <img class="image" :src="img" ref="image">
  <!-- 底部取消确定 -->
  <van-nav-bar
    class="toolbar"
    left-text="取消"
    right-text="确认"
    @click-left="$emit('close-popup')"
    @click-right="onConfirm"
  />
</div>
</template>



<script>
import {updateUserPhoto} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'   //图片裁切

export default {
  name: 'UpdateAvatar',
  // 组件参数 接收来自父组件的数据
  props: {
    // 预览图片原始格式路径
    file: {
      type: File,
      required: true
    }
  },

  // 局部注册的组件
  components: {},

  // 组件状态值
  data () {
    return {
      img: window.URL.createObjectURL(this.file),    //预览图片的blob格式
      cropper: null   //裁切器实例
    }
  },

  // 生命周期函数
  created () {
  },
  mounted () {
    // !需要操作DOM，所以在这里进行
    // const image = document.getElementById('image')
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },

  // 计算属性
  computed: {},

  // 组件方法
  methods: {
    // &获取裁切后的头像
    getCroppedCanvas() {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)   //裁切后的文件对象
        })
      })

    },

    // &点击确定按钮上传头像
    async onConfirm() {
      this.$toast.loading({
      message: '保存中...',
      forbidClick: true,
      duration: 0
      })
      // 1.请求获取数据提交
      // 注意：如果要求Content-Type 是multipart/form-data，则一定要提交FormData数据对象，专门用来文件上传，不能提交{}，没用
      // const fd = new FormData()
      // fd.append('phpto', this.file)
      // !将最新裁剪的图片传进来
      const file = await this.getCroppedCanvas()    
      const fd = new FormData()
      fd.append('phpto', file)

      await updateUserPhoto(fd)
      // 发送事件修改父组件的头像
      // this.$emit('update-avatar', this.img)
      this.$emit('update-avatar', window.URL.createObjectURL(file)) //将文件转成bolb数据
      // 3.关闭弹出层，提示修改成功
      this.$emit('close-popup')
      this.$toast.success("修改完成")
    },
  },

  // 侦听器
  watch: {},
}
</script> 

<style scoped lang='less'>
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  /deep/.van-nav-bar__text {
    color: #fff;
  }
}

/* Ensure the size of the image fit the container perfectly */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
