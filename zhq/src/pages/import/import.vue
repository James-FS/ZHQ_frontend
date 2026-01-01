<template>
  <view class="import-page">
    <view class="auth-card">
      <view class="title-section">
        <text class="main-title">教务系统同步</text>
        <text class="sub-title">请输入您的学号与教务系统密码</text>
      </view>

      <view class="form-section">
        <view class="input-item">
          <text class="label">学号</text>
          <input v-model="form.username" placeholder="请输入教务系统学号" />
        </view>
        <view class="input-item">
          <text class="label">密码</text>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入教务密码"
          />
        </view>
      </view>

      <view class="tips-section">
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#ff9800"></uni-icons>
          <text>数据仅用于课表抓取，系统不会保存您的密码。</text>
        </view>
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#ff9800"></uni-icons>
          <text>请确保学号输入正确，避免后端校验失败。</text>
        </view>
      </view>

      <button class="submit-btn" :loading="loading" @click="doImport">
        开始导入
      </button>
      <text class="back-link" @click="goBack">返回课表</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(false);
const form = ref({
  username: "",
  password: "",
});

const goBack = () => {
  uni.navigateBack();
};

const doImport = () => {
  if (!form.value.username || !form.value.password) {
    uni.showToast({ title: "信息填写不完整", icon: "none" });
    return;
  }

  loading.value = true;

  // 对接后端 ZHQ_BACKEND
  uni.request({
    url: "http://localhost:8080/api/v1/course/import", // 根据实际后端地址修改
    method: "POST",
    data: {
      username: form.value.username,
      password: form.value.password,
    },
    success: (res) => {
      if (res.data.code === 200) {
        uni.showToast({ title: "同步成功", icon: "success" });
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({ title: res.data.message || "导入失败", icon: "none" });
      }
    },
    fail: () => {
      uni.showToast({ title: "网络连接失败", icon: "none" });
    },
    complete: () => {
      loading.value = false;
    },
  });
};
</script>

<style lang="scss">
.import-page {
  min-height: 100vh;
  background-color: #fcfdf7;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.auth-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.05);

  .title-section {
    margin-bottom: 60rpx;
    .main-title {
      font-size: 48rpx;
      font-weight: bold;
      color: #333;
      display: block;
    }
    .sub-title {
      font-size: 26rpx;
      color: #999;
      margin-top: 10rpx;
      display: block;
    }
  }

  .form-section {
    .input-item {
      margin-bottom: 40rpx;
      .label {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 15rpx;
        display: block;
      }
      input {
        background-color: #f5f7f2;
        height: 100rpx;
        border-radius: 20rpx;
        padding: 0 30rpx;
        font-size: 30rpx;
      }
    }
  }

  .tips-section {
    margin: 40rpx 0;
    .tip-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10rpx;
      text {
        font-size: 22rpx;
        color: #ff9800;
        margin-left: 10rpx;
        line-height: 1.4;
      }
    }
  }

  .submit-btn {
    background-color: #8bc34a;
    color: #ffffff;
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    margin-top: 20rpx;
  }

  .back-link {
    display: block;
    text-align: center;
    margin-top: 40rpx;
    font-size: 28rpx;
    color: #999;
  }
}
</style>