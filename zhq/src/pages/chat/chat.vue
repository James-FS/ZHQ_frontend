<template>
  <view class="chat-page">
    <!-- 聊天页面顶部导航栏 -->
    <view class="chat-header">
      <view class="header-left" @click="goBack">
        <image class="back-icon" src="/static/icon/返回.svg" mode="aspectFit"></image>
      </view>
      <view class="header-center">
        <text class="chat-title">{{ chatUser.username }}</text>
      </view>
      <view class="header-right">
        <image class="more-icon" src="/static/icon/更多.svg" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view class="chat-messages" scroll-y="true" :scroll-into-view="scrollToView" :scroll-with-animation="true">
      <!-- 日期分隔线 -->
      <view class="date-divider">
        <text class="date-text">{{ currentDate }}</text>
      </view>

      <!-- 消息列表 -->
      <view class="message-list">
        <view 
          class="message-item" 
          v-for="(message, index) in messageList" 
          :key="index"
          :id="'msg' + index"
          :class="message.isSelf ? 'self' : 'other'"
        >
          <!-- 对方消息 -->
          <view v-if="!message.isSelf" class="message-wrapper other-message">
            <image class="avatar" :src="message.avatar" mode="aspectFill"></image>
            <view class="message-content">
              <view class="message-bubble other-bubble">
                <text class="message-text">{{ message.content }}</text>
              </view>
            </view>
          </view>

          <!-- 自己的消息 -->
          <view v-if="message.isSelf" class="message-wrapper self-message">
            <view class="message-content">
              <view class="message-bubble self-bubble">
                <text class="message-text">{{ message.content }}</text>
              </view>
            </view>
            <image class="avatar" :src="message.avatar" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="chat-input-area">
      <view class="input-wrapper">
        <image class="emoji-icon" src="/static/icon/表情.svg" mode="aspectFit" @click="showEmoji"></image>
        <input 
          class="message-input" 
          type="text" 
          v-model="inputMessage" 
          placeholder="发送消息"
          @confirm="sendMessage"
          confirm-type="send"
        />
        <image class="send-icon" src="/static/icon/发送.svg" mode="aspectFit" @click="sendMessage"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chatUser: {
        id: 2,
        username: '鬼叶',
        avatar: '/static/icon/头像2.svg'
      },
      inputMessage: '',
      scrollToView: '',
      currentDate: '11月6日',
      messageList: [
        {
          id: 1,
          content: '你好，请点击链接加入我的团队',
          time: '11月6日 13:14',
          isSelf: false,
          avatar: '/static/icon/头像2.svg'
        },
        {
          id: 2,
          content: '好的，谢谢',
          time: '11月6日 13:15',
          isSelf: true,
          avatar: '/static/icon/头像4.svg'
        }
      ]
    }
  },

  onLoad(option) {
    // 从页面参数获取用户信息
    if (option.userId && option.username) {
      this.chatUser.id = option.userId;
      // 对用户名进行解码
      this.chatUser.username = decodeURIComponent(option.username);
      
      // 根据用户ID设置头像
      const avatarMap = {
        '1': '/static/icon/头像1.svg',
        '2': '/static/icon/头像2.svg',
        '3': '/static/icon/头像3.svg',
        '4': '/static/icon/github.svg',
        '5': '/static/icon/google.svg'
      };
      this.chatUser.avatar = avatarMap[option.userId] || '/static/icon/头像2.svg';
    }

    // 设置当前日期
    this.setCurrentDate();
    
    // 滚动到底部
    this.scrollToBottom();
  },

  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 发送消息
    sendMessage() {
      if (!this.inputMessage.trim()) {
        return;
      }

      const newMessage = {
        id: this.messageList.length + 1,
        content: this.inputMessage,
        time: this.formatCurrentTime(),
        isSelf: true,
        avatar: '/static/icon/头像4.svg'
      };

      this.messageList.push(newMessage);
      this.inputMessage = '';

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    // 显示表情面板
    showEmoji() {
      uni.showToast({
        title: '表情功能开发中',
        icon: 'none'
      });
    },

    // 滚动到底部
    scrollToBottom() {
      if (this.messageList.length > 0) {
        this.scrollToView = 'msg' + (this.messageList.length - 1);
      }
    },

    // 格式化当前时间
    formatCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${this.currentDate} ${hours}:${minutes}`;
    },

    // 设置当前日期
    setCurrentDate() {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      this.currentDate = `${month}月${day}日`;
    }
  }
}
</script>

<style scoped lang="scss">
// 变量定义
$primary-bg: #f5f5f5;
$header-bg: #ffffff;
$input-bg: #ffffff;
$self-bubble-bg: #007AFF;
$other-bubble-bg: #ffffff;
$border-color: #e5e5e5;
$text-black: #000000;
$text-gray: #888888;
$text-white: #ffffff;
$divider-bg: rgba(0, 0, 0, 0.05);

$header-height: 120rpx;
$input-height: 120rpx;
$avatar-size: 80rpx;
$bubble-radius: 36rpx;

// Mixin
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $primary-bg;

  // 顶部导航栏
  .chat-header {
    height: $header-height;
    background-color: $header-bg;
    border-bottom: 1rpx solid $border-color;
    @include flex-between;
    padding: 0 32rpx;
    position: sticky;
    top: 0;
    z-index: 100;

    .header-left,
    .header-right {
      width: 80rpx;
      height: 80rpx;
      @include flex-center;

      .back-icon,
      .more-icon {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .header-center {
      flex: 1;
      @include flex-center;

      .chat-title {
        font-size: 36rpx;
        font-weight: 500;
        color: $text-black;
      }
    }
  }

  // 消息区域
  .chat-messages {
    flex: 1;
    padding: 0;
    overflow-y: auto;

    // 日期分隔线
    .date-divider {
      @include flex-center;
      margin: 40rpx 0 32rpx;

      .date-text {
        background-color: $divider-bg;
        padding: 12rpx 24rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        color: $text-gray;
      }
    }

    // 消息列表
    .message-list {
      padding-bottom: 32rpx;

      .message-item {
        margin-bottom: 32rpx;

        .message-wrapper {
          display: flex;
          align-items: flex-start;

          .avatar {
            width: $avatar-size;
            height: $avatar-size;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .message-content {
            display: flex;
            flex-direction: column;
            max-width: 500rpx;

            .message-bubble {
              padding: 24rpx 32rpx;
              border-radius: $bubble-radius;
              margin-bottom: 8rpx;
              position: relative;

              .message-text {
                font-size: 32rpx;
                line-height: 1.4;
                word-break: break-word;
              }
            }
          }
        }

        // 对方消息样式
        &.other .message-wrapper {
          justify-content: flex-start;
          padding-left: 16rpx;

          .avatar {
            margin-right: 16rpx;
          }

          .message-content {
            align-items: flex-start;

            .message-bubble {
              background-color: $other-bubble-bg;
              border: 1rpx solid $border-color;

              &::before {
                content: '';
                position: absolute;
                left: -12rpx;
                top: 24rpx;
                width: 0;
                height: 0;
                border: 12rpx solid transparent;
                border-right-color: $other-bubble-bg;
              }

              .message-text {
                color: $text-black;
              }
            }
          }
        }

        // 自己消息样式
        &.self .message-wrapper {
          justify-content: flex-end;
          padding-right: 16rpx;

          .avatar {
            margin-left: 8rpx;
          }

          .message-content {
            align-items: flex-end;

            .message-bubble {
              background-color: $self-bubble-bg;

              &::after {
                content: '';
                position: absolute;
                right: -12rpx;
                top: 24rpx;
                width: 0;
                height: 0;
                border: 12rpx solid transparent;
                border-left-color: $self-bubble-bg;
              }

              .message-text {
                color: $text-white;
              }
            }
          }
        }
      }
    }
  }

  // 底部输入区域
  .chat-input-area {
    background-color: $input-bg;
    border-top: 1rpx solid $border-color;
    padding: 24rpx 32rpx;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

    .input-wrapper {
      @include flex-center;
      background-color: #f8f8f8;
      border-radius: 48rpx;
      padding: 16rpx 24rpx;
      gap: 16rpx;

      .emoji-icon,
      .send-icon {
        width: 48rpx;
        height: 48rpx;
        flex-shrink: 0;
      }

      .message-input {
        flex: 1;
        background-color: transparent;
        border: none;
        font-size: 32rpx;
        line-height: 1.4;

        &::placeholder {
          color: #999999;
        }
      }
    }
  }
}
</style>
