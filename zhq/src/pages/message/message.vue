<template>
  <view class="message-page">
    <!-- 整体可滚动区域，包含header和消息列表 -->
    <scroll-view class="content-scroll" scroll-y="true" refresher-enabled="true" :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh">
      <!-- 顶部导航栏-->
      <view class="header-content">
        <view class="header-user">
          <image class="user-avatar" src="/static/icon/头像4.svg" mode="aspectFill"></image>
          <text class="user-name">小明</text>
        </view>
        <view class="header-icons">
          <image class="icon search" src="/static/icon/搜索.svg" @click="handleSearch" mode="aspectFit"></image>
          <image class="icon add" src="/static/icon/新建.svg" @click="handleAdd" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 消息列表-->
      <view class="message-list">
        <view class="message-item" v-for="(item, index) in messageList" :key="index" @click="openChat(item)">
          <view class="avatar-container">
            <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
            <view v-if="item.unreadCount > 0" class="unread-badge">
              <text class="unread-text">{{ item.unreadCount > 99 ? '99+' : item.unreadCount }}</text>
            </view>
          </view>

          <view class="message-content">
            <view class="top-row">
              <text class="username">{{ item.username }}</text>
              <text class="time">{{ item.time }}</text>
            </view>
            <view class="bottom-row">
              <text class="last-message">{{ item.lastMessage }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      refreshing: false,
      messageList: [
        {
          id: 1,
          username: '小地',
          lastMessage: '今天天气不错',
          time: '周二',
          avatar: '/static/icon/头像1.svg',
          unreadCount: 0,
          isOnline: true
        },
        {
          id: 2,
          username: '小叶',
          lastMessage: '确实不错',
          time: '周二',
          avatar: '/static/icon/头像2.svg',
          unreadCount: 2,
          isOnline: true
        },
        {
          id: 3,
          username: '小袋',
          lastMessage: '天气确实很不错',
          time: '2025年12月16日',
          avatar: '/static/icon/头像3.svg',
          unreadCount: 1,
          isOnline: false
        },
        {
          id: 4,
          username: 'copilot',
          lastMessage: '您的Copilot申请...',
          time: '2025年12月9日',
          avatar: '/static/icon/github.svg',
          unreadCount: 0,
          isOnline: true
        }
      ]
    }
  },
  methods: {
    openChat(item) {
      console.log('打开聊天:', item.username)
      
      // 跳转到聊天页面，传递用户信息
      uni.navigateTo({
        url: `/pages/chat/chat?userId=${item.id}&username=${encodeURIComponent(item.username)}`
      })
    },

    // 格式化时间显示
    formatTime(timeStr) {
      const now = new Date()
      const today = now.toDateString()

      if (timeStr.includes('周')) {
        return timeStr
      } else if (timeStr.includes('年')) {
        return timeStr.replace('年', '/').replace('月', '/').replace('日', '')
      }
      return timeStr
    },

    // 搜索功能
    handleSearch() {
      uni.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      })
    },

    // 添加联系人
    handleAdd() {
      uni.showToast({
        title: '添加联系人功能开发中',
        icon: 'none'
      })
    },

    // 下拉刷新
    onRefresh() {
      this.refreshing = true

      // 模拟刷新数据
      setTimeout(() => {
        this.refreshing = false
        uni.showToast({
          title: '刷新完成',
          icon: 'success',
          duration: 600
        })

        // 这里可以重新加载消息列表数据
        // this.loadMessageList()
      }, 600)
    }
  }
}
</script>

<style scoped lang="scss">
// 变量定义
$primary-bg: #f7f7f7;
$header-bg: #ededed;
$white-bg: #ffffff;
$border-color: #e5e5e5;
$header-border: #d9d9d9;
$text-black: #000000;
$text-gray: #888888;
$text-light-gray: #999999;
$red-badge: #ff4444;

$header-height: 88rpx;
$avatar-size: 96rpx;
$small-avatar-size: 88rpx;
$border-radius: 8rpx;
$badge-radius: 24rpx;

// 垂直居中
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

//两端对齐居中
@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

//文本溢出省略
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-page {
  height: 100vh;
  background-color: $primary-bg;
  display: flex;
  flex-direction: column;

  // 整体可滚动区域
  .content-scroll {
    flex: 1;
    background-color: $white-bg;
  }

  // 顶部导航栏 - 现在和消息列表背景一致
  .header-content {
    background-color: $white-bg;
    padding: 0 32rpx;
    border-bottom: 1rpx solid $border-color;
    height: $header-height;
    @include flex-between;

    .header-user {
      @include flex-center;
      gap: 16rpx;

      .user-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
      }

      .user-name {
        font-size: 34rpx;
        font-weight: 500;
        color: $text-black;
      }
    }

    .header-icons {
      @include flex-center;
      gap: 32rpx;

      .icon {
        font-size: 36rpx;
        color: $text-black;
        width: 48rpx;
        height: 48rpx;
        @include flex-center;
      }
    }
  }

  // 消息列表
  .message-list {
    background-color: $white-bg;

    .message-item {
      display: flex;
      padding: 20rpx 32rpx;
      border-bottom: 1rpx solid $border-color;
      background-color: $white-bg;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }

      &:active {
        background-color: #ebebeb;
      }
    }

    .avatar-container {
      margin-right: 24rpx;
      position: relative;

      .avatar {
        width: $avatar-size;
        height: $avatar-size;
      }

      .unread-badge {
        position: absolute;
        top: -5rpx;
        right: -5rpx;
        background-color: $red-badge;
        border-radius: 100%;
        min-width: 32rpx;
        height: 32rpx;
        @include flex-center;

        .unread-text {
          color: $white-bg;
          font-size: 18rpx;
          font-weight: 600;
        }
      }
    }

    .message-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: $avatar-size;
      padding: 6rpx 0;

      .top-row {
        @include flex-between;
        margin-bottom: 10rpx;

        .username {
          font-size: 32rpx;
          font-weight: 400;
          color: $text-black;
          flex: 1;
        }

        .time {
          font-size: 26rpx;
          color: $text-light-gray;
          margin-left: 16rpx;
          white-space: nowrap;
        }
      }

      .bottom-row {
        @include flex-center;

        .last-message {
          font-size: 28rpx;
          color: $text-gray;
          line-height: 1.3;
          flex: 1;
          @include text-ellipsis;
        }
      }
    }
  }

}
</style>