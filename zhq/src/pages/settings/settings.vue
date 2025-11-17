<template>
  <!-- 设置内容容器 -->
  <view class="settings-container">
      <!-- 页面标题 -->
      <view class="page-title">
        <text class="title-text">功能演示</text>
        <text class="subtitle-text">点击下方按钮体验各种组件功能</text>
      </view>
      
      <!-- 演示功能列表 -->
      <view class="demo-list">
        <!-- 按钮演示 -->
        <view class="demo-item" @click="goToDemoPage('button')">
          <view class="demo-left">
            <text class="iconfont icon-anniu demo-icon"></text>
            <view class="demo-info">
              <text class="demo-title">按钮演示</text>
              <text class="demo-desc">查看各种按钮样式和交互效果</text>
            </view>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
        
        <!-- 输入框演示 -->
        <view class="demo-item" @click="goToDemoPage('input')">
          <view class="demo-left">
            <text class="iconfont icon-shurukuang demo-icon"></text>
            <view class="demo-info">
              <text class="demo-title">输入框演示</text>
              <text class="demo-desc">体验各种输入框组件和功能</text>
            </view>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
        
        <!-- 选择框演示 -->
        <view class="demo-item" @click="goToDemoPage('select')">
          <view class="demo-left">
            <text class="iconfont icon-xuanzekuang demo-icon"></text>
            <view class="demo-info">
              <text class="demo-title">选择框演示</text>
              <text class="demo-desc">查看下拉选择和多选组件</text>
            </view>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
      </view>
      
      <!-- 其他设置 -->
      <view class="settings-section">
        <view class="section-title">
          <text class="section-title-text">其他设置</text>
        </view>
        
        <!-- 通用设置项 -->
        <view class="setting-item">
          <view class="setting-left">
            <text class="iconfont icon-tongzhi setting-icon"></text>
            <text class="setting-text">通知设置</text>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
        
        <view class="setting-item">
          <view class="setting-left">
            <text class="iconfont icon-yinsi setting-icon"></text>
            <text class="setting-text">隐私设置</text>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
        
        <view class="setting-item">
          <view class="setting-left">
            <text class="iconfont icon-bangzhu setting-icon"></text>
            <text class="setting-text">帮助与反馈</text>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
        
        <view class="setting-item" @click="goToTestPage">
          <view class="setting-left">
            <text class="iconfont icon-ceshi setting-icon"></text>
            <text class="setting-text">后端连接测试</text>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
        
        <view class="setting-item">
          <view class="setting-left">
            <text class="iconfont icon-guanyu setting-icon"></text>
            <text class="setting-text">关于我们</text>
          </view>
          <text class="iconfont icon-youjiantou arrow-icon"></text>
        </view>
      </view>
    </view>
</template>

<script>
export default {
  name: 'Settings',
  
  data() {
    return {
      // 可以在这里添加设置相关的数据
    }
  },
  
  onLoad() {
    console.log('设置页面加载')
  },
  
  methods: {
    // 跳转到演示页面
    goToDemoPage(type) {
      const urlMap = {
        button: '/pages/button-demo/button-demo',
        input: '/pages/input-demo/input-demo',
        select: '/pages/select-demo/select-demo'
      }
      
      const url = urlMap[type]
      if (url) {
        uni.navigateTo({
          url: url,
          success: () => {
            console.log(`跳转到${type}演示页面成功`)
          },
          fail: (err) => {
            console.error(`跳转到${type}演示页面失败:`, err)
            uni.showToast({
              title: '页面跳转失败',
              icon: 'none'
            })
          }
        })
      }
    },
    
    // 跳转到测试页面
    goToTestPage() {
      uni.navigateTo({
        url: '/pages/test/test',
        success: () => {
          console.log('跳转到后端连接测试页面成功')
        },
        fail: (err) => {
          console.error('跳转到后端连接测试页面失败:', err)
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 处理其他设置项点击
    handleSettingClick(type) {
      uni.showToast({
        title: `${type}功能暂未开放`,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 设置容器样式 */
.settings-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

/* 页面标题 */
.page-title {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  text-align: center;
}

.title-text {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.subtitle-text {
  font-size: 28rpx;
  color: #666666;
  display: block;
}

/* 演示功能列表 */
.demo-list {
  margin-bottom: 32rpx;
}

.demo-item {
  background-color: #ffffff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.demo-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.demo-icon {
  font-size: 48rpx;
  margin-right: 24rpx;
  color: #4A90E2;
}

.demo-info {
  display: flex;
  flex-direction: column;
}

.demo-title {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.demo-desc {
  font-size: 24rpx;
  color: #999999;
}

/* 设置分组 */
.settings-section {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-title-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-left {
  display: flex;
  align-items: center;
}

.setting-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
  color: #666666;
}

.setting-text {
  font-size: 30rpx;
  color: #333333;
}

/* 右箭头图标 */
.arrow-icon {
  font-size: 32rpx;
  color: #cccccc;
}
</style>
