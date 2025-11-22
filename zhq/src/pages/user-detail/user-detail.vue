<template>
  <view class="page-wrapper">
    <view class="title">
      <h1>个人资料</h1>
    </view>
    <!-- 内容容器 -->
    <scroll-view
      class="detail-content"
      scroll-y
      :style="{ paddingTop: 0 + 'px' }"
    >
      <view class="detail-container">
        <!-- 资料列表项 -->
        <view class="info-section">
          <view class="info-item" @click="handleItemClick('avatar')">
            <text class="label">头像</text>
            <view class="right-content">
              <text class="iconfont icon-youjiantou arrow-icon"></text>
            </view>
          </view>

          <view class="info-item">
            <common-input
              label="昵称"
              class="input"
              v-model="userInfo.name"
              placeholder="请输入昵称"
            />
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item">
            <common-input
              label="性别"
              class="input"
              v-model="userInfo.gender"
              placeholder="请输入性别"
            />
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item">
            <common-input
              label="学院"
              class="input"
              v-model="userInfo.college"
              placeholder="请输入学院"
            />
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item">
            <common-input
              label="专业"
              class="input"
              v-model="userInfo.major"
              placeholder="请输入专业"
            />
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item">
            <common-input
              label="手机号"
              class="input"
              v-model="userInfo.phone"
              placeholder="请输入手机号"
              type="tel"
              :maxlength="11"
            />
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>
        </view>

        <!-- 标签区域 -->
        <view class="demo-section">
          <text class="section-title">标签</text>
          <view class="tags-container">
            <!-- 替换为TagsInput组件 -->
            <TagsInput v-model="userInfo.tags" />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import TagItem from "@/components/Tags.vue";
import TagsInput from "@/components/TagsInput.vue";
import CustomNavbar from "@/components/Custom-navbar.vue";
import navbarPaddingMixin from "@/components/Navbar-padding.js";
import { CommonInput } from "@/components/Input.vue";
export default {
  components: {
    TagItem,
    CustomNavbar,
    CommonInput,
    TagsInput,
  },
  mixins: [navbarPaddingMixin],
  data() {
    return {
      userInfo: {
        avatar: "",
        name: "",
        gender: "",
        college: "",
        major: "",
        phone: "",
        tags: [],
      },
    };
  },
  methods: {
    handleItemClick(type) {
      if (type === "avatar") {
        uni.navigateTo({
          url: "/pages/image-page/image-page",
        });
      } else {
        console.log(`点击了${type}项`);
      }
    },
    addTag() {
      uni.showToast({
        title: "添加标签功能待实现",
        icon: "none",
      });
    },
    goToPage(type) {
      const urlMap = {
        square: "/pages/square/square",
        message: "/pages/message/message",
        add: "/pages/add/add",
        team: "/pages/team/team",
        mine: "/pages/user/user",
      };
      uni.switchTab({
        url: urlMap[type],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 页面容器 */
.page-wrapper {
  min-height: 100vh;
  background: #f5f5f5;
}
.title {
  position: relative;
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  text-align: center;
  font-size: 50rpx;
  font-weight: 700;
  color: #333333;
  background: red;
}
.detail-content {
  min-height: 100vh;
  box-sizing: border-box;
  top: -200rpx; /* 调整顶部位置以适应导航栏 */
}

.detail-container {
  padding: 30rpx;
  max-width: 750rpx;
  margin: 0 auto;
}

/* 信息区域样式 */
.info-section {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx 0;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

/* 资料列表项样式：重新分配宽度 */
.info-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 0 30rpx;
  height: 120rpx;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
  /* 输入框容器：占满剩余宽度 */
  .input {
    flex: 1;
    height: auto;
    line-height: normal;
    padding: 0 24rpx;
    border: none;
    background: transparent;
    color: #666;
    font-size: 28rpx;
    box-sizing: border-box;
  }

  /* 箭头图标：固定宽度，不挤压输入框 */
  .arrow-icon {
    font-size: 32rpx;
    color: #cccccc;
    width: 40rpx; /* 固定宽度 */
    text-align: center;
    margin-left: 10rpx;
  }
}

/* 标签区域样式 */
.demo-section {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 4rpx solid #f0f0f0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding-top: 10rpx;

  .add-tag {
    display: flex;
    align-items: center;
    padding: 15rpx 25rpx;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    font-size: 28rpx;
    color: #666;

    .icon-jiahao {
      margin-right: 8rpx;
    }
  }
}

/* 适配common-input组件样式 */
::v-deep .common-input {
  flex: 1;
}
::v-deep .input-wrapper {
  margin-bottom: 0;
  width: 100%;
}

::v-deep .input-label {
  font-size: 32rpx;
  color: #333;
  width: 140rpx;
}

::v-deep .input-main {
  gap: 0;
  flex: 1;
}

::v-deep .input-container {
  padding: 0;
  font-size: 32rpx;
}

/* 穿透修改输入框核心样式，确保可交互 */
::v-deep .input-control {
  width: 100%;
  min-height: 60rpx;
  padding: 10rpx 15rpx;
  pointer-events: auto !important; /* 强制允许点击 */
  user-select: text !important; /* 强制允许选中文本 */
}
</style>