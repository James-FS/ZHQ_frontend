<template>
  <view class="page-wrapper">
    <!-- 内容容器 -->
    <scroll-view
      class="detail-content"
      scroll-y
      :style="{ paddingTop: 0 + 'px' }"
    >
      <view class="detail-container">
        <!-- 资料列表项 -->
        <view class="info-section">
          <!-- user-detail.vue 模板中头像项 -->
          <view
            class="info-item avatar-item"
            @click="handleItemClick('avatar')"
          >
            <text class="label">头像</text>
            <!-- 显示当前头像，无头像时用默认图 -->
            <image
              :src="userInfo.avatar || defaultAvatar"
              class="avatar-img"
              mode="cover"
            ></image>
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item" @click="handleEdit('name')">
            <text class="label">昵称</text>
            <text class="value">{{ userInfo.name || "未填写" }}</text>
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item" @click="handleEdit('gender')">
            <text class="label">性别</text>
            <text class="value">{{ userInfo.gender || "未填写" }}</text>
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item" @click="handleEdit('college')">
            <text class="label">学院</text>
            <text class="value">{{ userInfo.college || "未填写" }}</text>
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>
          <view class="info-item" @click="handleEdit('major')">
            <text class="label">专业</text>
            <text class="value">{{ userInfo.major || "未填写" }}</text>
            <text class="iconfont icon-youjiantou arrow-icon"></text>
          </view>

          <view class="info-item" @click="handleEdit('phone')">
            <text class="label">手机号</text>
            <text class="value">{{ userInfo.phone || "未填写" }}</text>
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
        currentAvatar: "/static/icon/头像1.svg",
      },
      defaultAvatar: "/static/icon/头像1.svg",
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
    // user-detail.vue 的 methods 中修正 handleEdit
    handleEdit(type) {
      // 导航到富文本编辑页
      uni.navigateTo({
        url: "/pages/signature-edit/signature-edit",
        success: (res) => {
          // 传递当前字段的已有值（如 type 是 name，则传递 userInfo.name）
          res.eventChannel.emit("signatureData", {
            currentValue: this.userInfo[type], // 根据 type 动态获取字段值
            fieldType: type, // 传递字段类型，方便后续区分（可选）
          });

          // 监听编辑页返回的新值，更新对应字段
          res.eventChannel.on("signatureSaved", (data) => {
            this.userInfo[type] = data.signature; // 根据 type 动态更新字段
          });
        },
      });
    },
    handleItemClick(type) {
      if (type === "avatar") {
        uni.navigateTo({
          url: "/pages/image-page/image-page",
          success: (res) => {
            // 传递当前头像路径
            res.eventChannel.emit("currentAvatar", {
              avatar: this.userInfo.avatar,
            });
            // 监听头像选择结果，更新 userInfo.avatar
            res.eventChannel.on("avatarSelected", (data) => {
              this.userInfo.avatar = data.avatar;
            });
          },
        });
      }
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
  border-bottom: 1px solid #f0f0f0;
  .value {
    flex: 1;
    text-align: right;
    color: #666;
    font-size: 28rpx;
  }
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
// user-detail.vue 的样式
.avatar-item {
  display: flex;
  align-items: center;
  .avatar-img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-left: 450rpx;
  }
  .arrow-icon {
    margin-left: auto; // 让箭头靠右
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