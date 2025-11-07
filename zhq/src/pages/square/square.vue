<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    
    <!-- 演示按钮区域 -->
    <view class="demo-buttons">
      <common-button 
        text="查看按钮样式展示"
        type="primary"
        size="medium"
        @click="goToButtonDemo"
      />
      <common-button 
        text="输入框演示"
        type="secondary"
        size="medium"
        @click="goToInputDemo"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '广场页面',
    }
  },
  onLoad() {},
  methods: {
    goToButtonDemo() {
      uni.navigateTo({
        url: '/pages/button-demo/button-demo'
      });
    },
    goToInputDemo() {
      uni.navigateTo({
        url: '/pages/input-demo/input-demo'
      });
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  width: 100%;
  max-width: 600rpx;
}
</style>
