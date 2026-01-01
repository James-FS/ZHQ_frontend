<template>
  <!-- ==================== 新增：最外层容器 ==================== -->
  <view class="page-wrapper">
    <!-- ==================== 新增：使用渐变背景组件 ==================== -->
    <gradient-background
      height="800rpx"
      top-color="#D3E4FE"
      mid-color="#EFF4FA"
      bottom-color="#F5F6FB"
    ></gradient-background>

    <!-- ==================== 新增：使用自定义导航栏组件 ==================== -->
    <Custom-navbar title="个人中心" :show-back="false"></Custom-navbar>

    <!-- ==================== 修改：原有内容容器，添加动态 paddingTop ==================== -->
    <view
      class="mine-container"
      :style="{ paddingTop: contentPaddingTop + 'px' }"
    >
      <!-- 顶部用户信息卡片 -->
      <view class="user-card">
        <!-- 顶部区域：头像和用户信息横向排列 -->
        <view class="user-header">
          <!-- 用户头像 -->
          <image
            class="avatar"
            :src="userInfo.avatar || '/static/img/我_active.png'"
            mode="aspectFill"
          />

          <!-- 用户信息区域 -->
          <view class="user-info">
            <!-- 用户名 -->
            <text class="username">{{ userInfo.nickname || "未设置昵称" }}</text>

            <!-- 性别和学院信息 -->
            <view class="info-row">
              <!-- 性别图标和文字 -->
              <view class="gender-box">
                <!-- Font Class 方式：iconfont + 具体图标类名 -->
                <text 
                  class="iconfont gender-icon" 
                  :class="userInfo.gender === 1 ? 'icon-nan' : userInfo.gender === 2 ? 'icon-nv' : 'icon-wenhao'"
                ></text>
                <text class="gender-text">{{ getGenderText(userInfo.gender) }}</text>
              </view>

              <!-- 分隔符 -->
              <text class="divider">|</text>

              <!-- 学院信息 -->
              <text class="college">{{ userInfo.college || "未设置学院" }}</text>
            </view>
          </view>
        </view>

        <!-- 标签区域 -->
        <view class="tags-container">
          <!-- 循环渲染标签，使用自定义组件，修改属性名为 tagText -->
          <TagItem
            v-for="(tag, index) in userInfo.tags"
            :key="index"
            :tagText="tag"
          />
        </view>

        <!-- 查看详情按钮 -->
        <view class="detail-btn" @click="goToDetail">
          <text class="detail-text">{{ userInfo.user_id ? '编辑资料' : '登录/注册' }}</text>
        </view>
      </view>

      <!-- 功能列表 - 改为独立卡片 -->
      <!-- 我的收藏 -->
      <view class="menu-item" @click="goToPage('collection')">
        <!-- 左侧图标 -->
        <view class="menu-left">
          <!-- Font Class 方式：基础类 iconfont + 图标类 icon-xxx -->
          <text class="iconfont icon-shoucang menu-icon"></text>
          <text class="menu-text">我的收藏</text>
        </view>
        <!-- 右侧箭头 -->
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

      <!-- 浏览历史 -->
      <view class="menu-item" @click="goToPage('history')">
        <view class="menu-left">
          <!-- Font Class 方式：时钟图标 -->
          <text class="iconfont icon-liulanlishi1 menu-icon"></text>
          <text class="menu-text">浏览历史</text>
        </view>
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

      <!-- 我的简历 -->
      <view class="menu-item" @click="goToPage('resume')">
        <view class="menu-left">
          <!-- Font Class 方式：你提供的在线简历图标 -->
          <text class="iconfont icon-zaixianjianli menu-icon"></text>
          <text class="menu-text">我的简历</text>
        </view>
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

      <!-- 系统设置 -->
      <view class="menu-item" @click="goToPage('settings')">
        <view class="menu-left">
          <!-- 系统设置图标（请根据实际图标类名修改） -->
          <text class="iconfont icon-shezhi menu-icon"></text>
          <text class="menu-text">系统设置</text>
        </view>
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

       <!-- 校园导航 -->
      <view class="menu-item" @click="goToPage('map')">
        <view class="menu-left">
          <!-- Font Class 方式：你提供的在线简历图标 -->
          <text class="iconfont icon-zaixianjianli menu-icon"></text>
          <text class="menu-text">校园导航</text>
        </view>
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

      <!-- 课程表 -->
      <view class="menu-item" @click="goToPage('map')">
        <view class="menu-left">
          <!-- Font Class 方式：你提供的在线简历图标 -->
          <text class="iconfont icon-zaixianjianli menu-icon"></text>
          <text class="menu-text">课程表</text>
        </view>
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

      <!-- 退出登录 -->
      <view class="menu-item" @click="goToPage('logout')">
        <view class="menu-left">
          <!-- 退出登录图标（请根据实际图标类名修改） -->
          <text class="iconfont icon-tuichudenglu menu-icon"></text>
          <text class="menu-text">退出登录</text>
        </view>
        <text class="iconfont icon-youjiantou arrow-icon"></text>
      </view>

    </view>
  </view>
</template>

<script>
// 引入标签组件
import TagItem from "@/components/Tags.vue";
import GradientBackground from "@/components/Grandient-background.vue";
import CustomNavbar from "@/components/Custom-navbar.vue";
import navbarPaddingMixin from "@/components/Navbar-padding.js";
// 引入API工具函数
import { api } from "@/utils/index.js";

export default {
  // ==================== 修改：注册渐变背景和自定义导航栏组件 ====================
  components: {
    TagItem,
    GradientBackground, // 新增
    CustomNavbar, // 新增
  },

  // ==================== 新增：使用混入（自动提供 contentPaddingTop 和 setContentPadding 方法） ====================
  mixins: [navbarPaddingMixin],

  data() {
    return {
      // 用户信息数据
      userInfo: {
        user_id: "",
        nickname: "",
        avatar: "/static/icon/头像1.svg", // 默认头像
        gender: 0, // 0:未知 1:男 2:女
        college: "",
        major: "",
        tags: [], // 标签数组
      },
    };
  },

  onLoad() {
    // 页面加载时获取用户信息
    this.getUserInfo();
  },

  methods: {
    // 获取用户信息
    async getUserInfo() {
      try {
        // 调用后端API获取用户信息
        const response = await api.getUserInfo();
        
        if (response.code === 0 && response.data && response.data.user) {
          const userData = response.data.user;
          
          // 处理用户数据
          this.userInfo = {
            user_id: userData.user_id || "",
            nickname: userData.nickname || "未设置昵称",
            avatar: userData.avatar || "/static/icon/头像1.svg",
            gender: userData.gender || 0,
            college: userData.college || "未设置学院",
            major: userData.major || "未设置专业", // 注意：后端可能没有这个字段
            tags: this.parseTags(userData.tags) // 解析标签
          };
          
          // 调试输出
          console.log("原始tags数据:", userData.tags);
          console.log("解析后的tags:", this.userInfo.tags);
        } else if (response.code === 401) {
          // 未登录，使用默认信息
          console.log("用户未登录，使用默认信息");
          this.userInfo = {
            user_id: "",
            nickname: "游客",
            avatar: "/static/icon/头像1.svg",
            gender: 0,
            college: "未登录",
            major: "未登录",
            tags: []
          };
        } else {
          console.error("获取用户信息失败:", response.message);
          // 失败时使用默认信息
          this.userInfo = {
            user_id: "",
            nickname: "游客",
            avatar: "/static/icon/头像1.svg",
            gender: 0,
            college: "未设置学院",
            major: "未设置专业",
            tags: []
          };
        }
      } catch (error) {
        console.error("获取用户信息异常:", error);
        // 异常时使用默认信息
        this.userInfo = {
          user_id: "",
          nickname: "游客",
          avatar: "/static/icon/头像1.svg",
          gender: 0,
          college: "未设置学院",
          major: "未设置专业",
          tags: []
        };
      }
    },

    // 解析标签数据
    parseTags(tagsData) {
      if (!tagsData) return [];
      
      try {
        // 如果是字符串，先尝试JSON解析
        if (typeof tagsData === 'string') {
          try {
            const parsed = JSON.parse(tagsData);
            return Array.isArray(parsed) ? parsed : [tagsData];
          } catch {
            // JSON解析失败，直接将整个字符串作为一个标签
            return [tagsData];
          }
        }
        // 如果已经是数组，直接返回
        if (Array.isArray(tagsData)) {
          return tagsData;
        }
        // 如果是数字，转为字符串数组
        if (typeof tagsData === 'number') {
          return [tagsData.toString()];
        }
      } catch (error) {
        console.error("解析标签失败:", error);
      }
      
      // 确保返回数组，如果是字符串就包装成数组
      return Array.isArray(tagsData) ? tagsData : [tagsData];
    },

    // 格式化性别显示
    getGenderText(gender) {
      const genderMap = {
        0: "未知",
        1: "男",
        2: "女"
      };
      return genderMap[gender] || "未知";
    },

    // 跳转到详情页
    goToDetail() {
      // 检查用户是否已登录（通过user_id判断）
      if (!this.userInfo.user_id) {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: "/pages/login/login",
        });
      } else {
        // 已登录，跳转到编辑资料页面
        uni.navigateTo({
          url: "/pages/user-detail/user-detail",
        });
      }
    },

    // 跳转到对应功能页面
    goToPage(type) {
      // 页面路由映射表
      const urlMap = {
        collection: '/pages/collection/collection', // 收藏页面
        history: '/pages/history/history', // 历史页面
        resume: '/pages/resume/resume', // 简历页面
        settings: '/pages/settings/settings', // 设置页面
        logout: '/pages/login/login', // 退出登录页面
        schedule: '/pages/schedule/schedule', // 课程表页面
        map: '/pages/map/map' // 校园导航页面
      }
      
      // 特殊处理退出登录
      if (type === "logout") {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              // 执行退出登录逻辑
              console.log("用户确认退出");
              // 清除登录信息，跳转到登录页
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }
          },
        });
        return;
      }

      // 跳转到对应页面
      uni.navigateTo({
        url: urlMap[type],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* ==================== 新增：页面最外层包裹容器 ==================== */
.page-wrapper {
  position: relative; /* 相对定位，为子元素提供定位上下文 */
  min-height: 100vh; /* 最小高度为屏幕高度 */
}

/* ==================== 修改：页面容器样式 ==================== */
.mine-container {
  position: relative; /* 相对定位 */
  min-height: 100vh; /* 最小高度为屏幕高度 */
  background-color: transparent; /* 修改：改为透明，显示渐变背景 */
  padding: 20rpx; /* 保持原有左右内边距 */
  /* padding-top 通过动态绑定 :style 设置，在 template 中已添加 */
}

/* 用户信息卡片 */
.user-card {
  background-color: #ffffff; // 白色背景
  border-radius: 24rpx; // 圆角
  padding: 40rpx; // 内边距
  margin-bottom: 20rpx; // 底部外边距
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05); // 阴影效果
}

/* 用户头部区域 - 横向布局 */
.user-header {
  display: flex; // 弹性布局
  align-items: flex-start; // 顶部对齐
  margin-bottom: 24rpx; // 底部外边距
}

/* 头像样式 */
.avatar {
  width: 120rpx; // 宽度
  height: 120rpx; // 高度
  border-radius: 50%; // 圆形
  margin-right: 24rpx; // 右侧外边距
  flex-shrink: 0; // 不缩小
}

/* 用户信息区域 */
.user-info {
  flex: 1; // 占据剩余空间
  display: flex; // 弹性布局
  flex-direction: column; // 垂直排列
  justify-content: center; // 垂直居中
}

/* 用户名 */
.username {
  font-size: 40rpx; // 字体大小
  font-weight: bold; // 加粗
  color: #333333; // 字体颜色
  margin-bottom: 12rpx; // 底部外边距
}

/* 信息行（性别和学院） */
.info-row {
  display: flex; // 弹性布局
  align-items: center; // 垂直居中
  font-size: 28rpx; // 字体大小
  color: #333333; // 字体颜色
}

/* 性别容器 */
.gender-box {
  display: flex; // 弹性布局
  align-items: center; // 垂直居中
}

/* 性别图标 - Font Class 方式 */
.gender-icon {
  color: #4a90e2; // 蓝色
  margin-right: 8rpx; // 右侧外边距
  font-size: 32rpx; // 图标大小
}

/* 性别文字 */
.gender-text {
  color: #333333; // 灰色
}

/* 分隔符 */
.divider {
  margin: 0 16rpx; // 左右外边距
  color: #e0e0e0; // 浅灰色
}

/* 学院文字 */
.college {
  color: #333333; // 灰色
  flex: 1; // 占据剩余空间
}

/* 标签容器 */
.tags-container {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 8rpx; /* 间距（根据您原代码是8rpx） */
  margin-bottom: 32rpx;

  /* 新增：限制最多两行 */
  max-height: 80rpx; /* 限制最大高度 = 2 × 标签高度 */
}

/* 查看详情按钮 */
.detail-btn {
  width: 100%; // 宽度100%
  height: 88rpx; // 高度
  background: linear-gradient(90deg, #4fc3f7 0%, #1e98d7 100%); // 渐变背景
  border-radius: 20rpx; // 圆角
  display: flex; // 弹性布局
  align-items: center; // 垂直居中
  justify-content: center; // 水平居中
}

/* 查看详情文字 */
.detail-text {
  color: #ffffff; // 白色
  font-size: 32rpx; // 字体大小
  font-weight: 500; // 中等粗细
}

/* 菜单项 - 改为独立卡片 */
.menu-item {
  background-color: #ffffff; // 白色背景
  border-radius: 24rpx; // 圆角
  display: flex; // 弹性布局
  align-items: center; // 垂直居中
  justify-content: space-between; // 两端对齐
  padding: 32rpx 40rpx; // 内边距
  margin-bottom: 20rpx; // 底部外边距
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05); // 阴影
}

/* 菜单左侧（图标+文字） */
.menu-left {
  display: flex; // 弹性布局
  align-items: center; // 垂直居中
}

/* 菜单图标 - Font Class 方式 */
.menu-icon {
  font-size: 44rpx; // 图标大小（使用 font-size 控制）
  margin-right: 24rpx; // 右侧外边距
  color: #666666; // 图标颜色
}

/* 菜单文字 */
.menu-text {
  font-size: 32rpx; // 字体大小
  color: #333333; // 字体颜色
}

/* 右箭头图标 - Font Class 方式 */
.arrow-icon {
  font-size: 32rpx; // 图标大小（使用 font-size 控制）
  color: #cccccc; // 箭头颜色
}
</style>