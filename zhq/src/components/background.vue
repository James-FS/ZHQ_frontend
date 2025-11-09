<template>
  <!-- 渐变背景组件，可配置高度和颜色 -->
  <view 
    class="gradient-bg" 
    :style="{ 
      height: height,
      background: gradientStyle 
    }"
  ></view>
</template>

<script>
export default {
  name: 'GradientBackground',
  props: {
    // 渐变区域高度，默认 800rpx
    height: {
      type: String,
      default: '800rpx'
    },
    // 顶部颜色
    topColor: {
      type: String,
      default: '#D3E4FE'
    },
    // 中段颜色
    midColor: {
      type: String,
      default: '#EFF4FA'
    },
    // 底部颜色
    bottomColor: {
      type: String,
      default: '#F5F6FB'
    }
  },
  computed: {
    // 动态生成渐变样式
    gradientStyle() {
      return `linear-gradient(to bottom, ${this.topColor} 0%, ${this.midColor} 50%, ${this.bottomColor} 100%)`
    }
  }
}
</script>

<style scoped>
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
</style>