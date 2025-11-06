<!--
  标签组件
  tagText: 标签文本
-->
<template>
  <view class="tag-component">
    <view class="tag">
      <text class="tag-icon">#</text>
      <text class="tag-text">{{ tagText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tagText: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.tag-component {
  margin-left: 10rpx;
  margin-bottom: 10rpx;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8rpx;
  background: #e4eef4;
  font-family: Arial, sans-serif;
  font-size: 14px;
  height: 40rpx;
  max-width: 380rpx;
}

.tag {
  display: flex;
  align-items: center;
  max-width: 380rpx;
  min-width: 100rpx;
  /* width: 50rpx; */
}

.tag-icon {
  padding-left: 22rpx;
  padding-right: 10rpx;
  padding-top:5rpx;
  font-weight: bold;
  color:#084e8a;
}
.tag-text {
  max-width:330rpx;
  margin-right: 20rpx;
  color:#084e8a;
}
</style>