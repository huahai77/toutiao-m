/*
  postcss 配置文件
*/

module.exports = {
  plugins: {
    // 自动添加浏览器厂商声明前缀，用来兼容不同的浏览器
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把px转换为rem
    'postcss-pxtorem': {
      // 转换的根元素基准值
      rootValue: 37.5,
      // 需要转换的css属性，*代表所有属性都转换
      propList: ['*']
    }
  }
}