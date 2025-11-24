<template>
  <view class="page-wrapper">
    <view
      class="background-container"
      :style="{ backgroundImage: `url(${currentAvatar || defaultAvatar})` }"
    ></view>
    <view class="title">
      <text class="back" @click="goBack">＜</text>
      <text class="title-text">头像</text>
      <text class="more" @click="showActionSheet">...</text>
    </view>
    <image :src="currentAvatar" class="avatar-preview" mode="aspectFit"></image>
    <!-- 底部操作菜单 -->
    <view class="action-sheet" v-if="showSheet">
      <view class="action-item" @click="chooseFromAlbum">从手机相册选择</view>
      <view class="action-item" @click="viewLastAvatar">查看上一张头像</view>
      <view class="action-item cancel" @click="hideActionSheet">取消</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      currentAvatar: "",
      showSheet: false,
      lastAvatar: "", // 存储上一张头像路径
      currentAvatar: "",
      defaultAvatar: "/static/icon/头像1.svg", // 默认头像路径
    };
  },
  onLoad() {
    // 接收个人资料页传递的当前头像
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("currentAvatar", (data) => {
      this.currentAvatar = data.avatar;
      this.lastAvatar = data.avatar; // 初始化上一张头像为当前头像
    });
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    showActionSheet() {
      this.showSheet = true;
    },
    hideActionSheet() {
      this.showSheet = false;
    },
    // 从相册选择头像
    chooseFromAlbum() {
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.currentAvatar = tempFilePath;
          this.hideActionSheet();
          // 回传新头像路径到个人资料页
          const eventChannel = this.getOpenerEventChannel();
          eventChannel.emit("avatarSelected", {
            avatar: tempFilePath,
          });
          uni.showToast({ title: "头像选择成功", icon: "success" });
        },
      });
    },
    // 查看上一张头像
    viewLastAvatar() {
      if (this.lastAvatar) {
        this.currentAvatar = this.lastAvatar;
        // 回传上一张头像路径
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("avatarSelected", {
          avatar: this.lastAvatar,
        });
        uni.showToast({ title: "已切换至上一张头像", icon: "success" });
      } else {
        uni.showToast({ title: "暂无上一张头像", icon: "none" });
      }
      this.hideActionSheet();
    },
  },
};
</script>
<style>
.page-wrapper {
  min-height: 100vh;
  background: #00000036;
  padding: 0;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 30rpx;
  color: #fff;
}
.back,
.more {
  font-size: 40rpx;
}
.title-text {
  font-size: 36rpx;
  font-weight: bold;
}
.avatar-preview {
  width: 100%;
  height: calc(100vh - 80rpx);
  object-fit: contain;
}
.action-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}
.action-item {
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.action-item.cancel {
  color: #999;
}
/* image-page.vue 的样式 */
.page-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 80% auto;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;
  opacity: 0.8;
}

/* 其他内容的样式... */
.title {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 30rpx;
  color: #fff;
}
</style>