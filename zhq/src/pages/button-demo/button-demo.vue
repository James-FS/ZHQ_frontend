<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-title">按钮组件展示</view>
    </view>

    <scroll-view scroll-y="true" class="scroll-content">
      <!-- 按钮类型示例 -->
      <view class="demo-section">
        <view class="section-title">按钮类型</view>
        <view class="button-group">
          <common-button 
            text="主要按钮" 
            type="primary"
            @click="handleButtonClick('主要按钮')"
          />
          <common-button 
            text="次要按钮" 
            type="secondary"
            @click="handleButtonClick('次要按钮')"
          />
          <common-button 
            text="危险按钮" 
            type="danger"
            @click="handleButtonClick('危险按钮')"
          />
          <common-button 
            text="警告按钮" 
            type="warning"
            @click="handleButtonClick('警告按钮')"
          />
          <common-button 
            text="成功按钮" 
            type="success"
            @click="handleButtonClick('成功按钮')"
          />
        </view>
      </view>

      <!-- 镂空按钮示例 -->
      <view class="demo-section">
        <view class="section-title">镂空按钮</view>
        <view class="button-group">
          <common-button 
            text="镂空主要" 
            type="primary"
            plain
            @click="handleButtonClick('镂空主要按钮')"
          />
          <common-button 
            text="镂空次要" 
            type="secondary"
            plain
            @click="handleButtonClick('镂空次要按钮')"
          />
          <common-button 
            text="镂空危险" 
            type="danger"
            plain
            @click="handleButtonClick('镂空危险按钮')"
          />
          <common-button 
            text="镂空警告" 
            type="warning"
            plain
            @click="handleButtonClick('镂空警告按钮')"
          />
          <common-button 
            text="镂空成功" 
            type="success"
            plain
            @click="handleButtonClick('镂空成功按钮')"
          />
        </view>
      </view>

      <!-- 按钮大小示例 -->
      <view class="demo-section">
        <view class="section-title">按钮大小</view>
        <view class="button-group">
          <common-button 
            text="小按钮" 
            size="small"
            @click="handleButtonClick('小按钮')"
          />
          <common-button 
            text="中按钮（默认）" 
            size="medium"
            @click="handleButtonClick('中按钮')"
          />
          <common-button 
            text="大按钮" 
            size="large"
            @click="handleButtonClick('大按钮')"
          />
        </view>
      </view>

      <!-- 按钮状态示例 -->
      <view class="demo-section">
        <view class="section-title">按钮状态</view>
        <view class="button-group">
          <common-button 
            text="正常按钮"
            @click="handleButtonClick('正常按钮')"
          />
          <common-button 
            text="禁用按钮" 
            disabled
          />
          <common-button 
            :text="isLoading ? '加载中' : '点击加载'" 
            :loading="isLoading"
            loading-text="加载中..."
            @click="handleLoading"
          />
        </view>
      </view>

      <!-- 圆形按钮示例 -->
      <view class="demo-section">
        <view class="section-title">圆形按钮</view>
        <view class="button-group button-group-round">
          <common-button 
            text="+"
            type="primary"
            size="small"
            :round="true"
            @click="handleButtonClick('圆形小按钮')"
          />
          <common-button 
            text="✓"
            type="success"
            size="medium"
            :round="true"
            @click="handleButtonClick('圆形中按钮')"
          />
          <common-button 
            text="✕"
            type="danger"
            size="large"
            :round="true"
            @click="handleButtonClick('圆形大按钮')"
          />
        </view>
      </view>

      <!-- 镂空圆形按钮示例 -->
      <view class="demo-section">
        <view class="section-title">镂空圆形按钮</view>
        <view class="button-group button-group-round">
          <common-button 
            text="+"
            type="primary"
            size="small"
            :round="true"
            plain
            @click="handleButtonClick('镂空圆形小按钮')"
          />
          <common-button 
            text="✓"
            type="success"
            size="medium"
            :round="true"
            plain
            @click="handleButtonClick('镂空圆形中按钮')"
          />
          <common-button 
            text="✕"
            type="danger"
            size="large"
            :round="true"
            plain
            @click="handleButtonClick('镂空圆形大按钮')"
          />
        </view>
      </view>

      <!-- 全宽按钮示例 -->
      <view class="demo-section">
        <view class="section-title">全宽按钮</view>
        <view class="button-group">
          <common-button 
            text="全宽提交按钮" 
            type="primary"
            full-width
            @click="handleButtonClick('全宽按钮')"
          />
          <common-button 
            text="全宽取消按钮" 
            type="secondary"
            full-width
            @click="handleButtonClick('全宽取消按钮')"
          />
        </view>
      </view>

      <!-- 组合使用示例 -->
      <view class="demo-section">
        <view class="section-title">组合使用</view>
        <view class="button-group">
          <common-button 
            text="大型主要全宽按钮" 
            type="primary"
            size="large"
            full-width
            @click="handleButtonClick('组合示例按钮')"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 消息提示 -->
    <view v-if="message" class="message">{{ message }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      isLoading: false,
    }
  },
  methods: {
    handleButtonClick(buttonName) {
      this.message = `点击了：${buttonName}`;
      console.log(`按钮点击：${buttonName}`);
      
      // 2秒后清空消息
      setTimeout(() => {
        this.message = '';
      }, 2000);
    },
    handleLoading() {
      this.isLoading = true;
      this.message = '模拟请求中...';
      
      // 模拟异步请求
      setTimeout(() => {
        this.isLoading = false;
        this.message = '加载完成！';
        
        // 2秒后清空消息
        setTimeout(() => {
          this.message = '';
        }, 2000);
      }, 2000);
    },
    goBack() {
      uni.navigateBack();
    },
    goToDebounceDemo() {
      uni.navigateTo({
        url: '/pages/debounce-demo/debounce-demo'
      });
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  border-bottom: 2rpx solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
  }

  .nav-actions {
    display: flex;
    gap: 16rpx;
    align-items: center;

    .nav-link {
      color: #2196f3;
      font-size: 28rpx;
      padding: 8rpx 16rpx;
      border-radius: 6rpx;
      background-color: #e3f2fd;
    }

    .nav-back {
      color: #2196f3;
      font-size: 28rpx;
      padding: 10rpx 20rpx;
      border-radius: 6rpx;
      background-color: #f0f8ff;
    }
  }
}

.scroll-content {
  flex: 1;
  padding: 20rpx;
}

.demo-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 24rpx;
    padding-bottom: 12rpx;
    border-bottom: 3rpx solid #2196f3;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: -3rpx;
      width: 60rpx;
      height: 3rpx;
      background-color: #2196f3;
    }
  }
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  /* 圆形按钮组使用水平布局 */
  &.button-group-round {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 40rpx;
  }
}


@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
</style>