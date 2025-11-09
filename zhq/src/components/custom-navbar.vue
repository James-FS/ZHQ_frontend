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