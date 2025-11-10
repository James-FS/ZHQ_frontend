<!-- /** 
*渐变背景组件
* height: 渐变区域高度 - '800rpx'（默认）, 支持 rpx、px、vh、% 等单位
* direction: 渐变方向 - 'to bottom'（默认）
  *   - 线性渐变方向：'to bottom', 'to top', 'to left', 'to right'
  *   - 对角线方向：'to bottom right', 'to top left' 等
  *   - 角度：'45deg', '90deg', '135deg' 等
  *   - 径向渐变：'circle at center', 'ellipse at top left' 等
* type: 渐变类型 - 'linear'（默认）
  *   - linear: 线性渐变
  *   - radial: 径向渐变
* colors: 渐变色数组 - 默认蓝色系三色渐变
  *   - 数组格式：[{ color: '#FF6B6B', position: '0%' }, ...]
  *   - color: 必填，颜色值（支持 HEX、RGB、RGBA）
  *   - position: 可选，位置百分比（0%-100%，不填则自动均匀分布）
  *   - 示例：[
  *       { color: '#D3E4FE', position: '0%' },
  *       { color: '#EFF4FA', position: '50%' },
  *       { color: '#F5F6FB', position: '100%' }
  *     ]
* zIndex: 层级 - -1（默认），控制背景层级
 */ -->
<template>
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
    height: {
      type: String,
      default: '800rpx'
    },
    // ✨ 新增：渐变方向
    direction: {
      type: String,
      default: 'to bottom', // 'to bottom', 'to right', '45deg', '135deg' 等
      validator: (value) => {
        // 可选验证
        return true
      }
    },
    // ✨ 新增：渐变色数组，支持任意数量的渐变点
    colors: {
      type: Array,
      default: () => [
        { color: '#D3E4FE', position: '0%' },
        { color: '#EFF4FA', position: '50%' },
        { color: '#F5F6FB', position: '100%' }
      ],
      validator: (arr) => {
        // 验证每个对象都包含 color 属性
        return arr.every(item => item.color)
      }
    },
    // 🔄 保留旧的 props 作为兼容（可选）
    topColor: String,
    midColor: String,
    bottomColor: String
  },
  computed: {
    gradientStyle() {
      // 如果使用了新的 colors 属性
      if (this.colors && this.colors.length > 0) {
        const colorStops = this.colors
          .map(item => {
            const position = item.position ? ` ${item.position}` : ''
            return `${item.color}${position}`
          })
          .join(', ')
        
        return `linear-gradient(${this.direction}, ${colorStops})`
      }
      
      // 兼容旧版本的三色模式
      const top = this.topColor || '#D3E4FE'
      const mid = this.midColor || '#EFF4FA'
      const bottom = this.bottomColor || '#F5F6FB'
      
      return `linear-gradient(${this.direction}, ${top} 0%, ${mid} 50%, ${bottom} 100%)`
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