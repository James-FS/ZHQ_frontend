<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    
    <!-- 新增按钮，点击跳转到按钮展示页面 -->
    <view class="button-area">
      <common-button 
        text="查看按钮样式展示"
        type="primary"
        size="medium"
        @click="goToButtonDemo"
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

.button-area {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
