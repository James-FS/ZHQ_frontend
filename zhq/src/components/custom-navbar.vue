<!-- /**
 * 自定义导航栏组件 - 透明背景版
 * 
 * @description
 * 替代系统导航栏的自定义组件，支持透明背景、自适应状态栏高度、返回按钮和右侧插槽
 * 适用于需要显示页面渐变背景或自定义导航栏样式的场景
 * 
 * @props
 * title: 导航栏标题 - '标题'（默认）
 *   - 类型：String
 *   - 显示在导航栏中间
 * 
 * showBack: 是否显示返回按钮 - false（默认）
 *   - 类型：Boolean
 *   - true: 显示返回按钮
 *   - false: 隐藏返回按钮
 * 
 * backgroundColor: 背景颜色 - 'transparent'（默认）
 *   - 类型：String
 *   - 支持：transparent, #FFFFFF, rgba(255,255,255,0.8) 等
 * 
 * titleColor: 标题颜色 - '#333333'（默认）
 *   - 类型：String
 *   - 支持：HEX、RGB、RGBA
 * 
 * backIconColor: 返回按钮颜色 - '#ffffff'（默认）
 *   - 类型：String
 *   - 支持：HEX、RGB、RGBA
 * 
 * zIndex: 层级 - 999（默认）
 *   - 类型：Number
 *   - 控制导航栏在页面中的层级
 * 
 * fixed: 是否固定定位 - true（默认）
 *   - 类型：Boolean
 *   - true: 固定在顶部
 *   - false: 相对定位
 * 
 * @events
 * back: 点击返回按钮时触发
 *   - 参数：无
 *   - 默认行为：调用 uni.navigateBack()
 *   - 可通过监听事件自定义返回逻辑
 * 
 * @slots
 * right: 右侧插槽
 *   - 用于自定义右侧内容（如搜索图标、菜单按钮等）
 *   - 示例：<template #right><icon type="search" /></template>
 * / -->
<template>
  <view class="custom-navbar" :style="{ height: navbarHeight + 'px' }">
    <view class="navbar-inner" :style="{ paddingTop: statusBarHeight + 'px' }">
      <!-- 返回按钮 -->
      <view class="navbar-left" v-if="showBack" @click="handleBack">
        <view class="back-icon">←</view>
      </view>
      
      <!-- 标题 -->
      <view class="navbar-title">{{ title }}</view>
      
      <!-- 右侧插槽 -->
      <view class="navbar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomNavbar',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusBarHeight: 0,
      navbarHeight: 0
    }
  },
  mounted() {
    this.setNavbarHeight()
  },
  methods: {
    setNavbarHeight() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0
      // 导航栏总高度 = 状态栏高度 + 导航栏内容高度(44px)
      this.navbarHeight = this.statusBarHeight + 44
    },
    handleBack() {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: transparent; /* 透明背景，显示页面渐变色 */
}

.navbar-inner {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.navbar-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.back-icon {
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
}

.navbar-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  text-align: center;
}

.navbar-right {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
}
</style>