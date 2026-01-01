<template>
  <view class="import-page">
    <view class="auth-card">
      <view class="title-section">
        <text class="main-title">导入课程表</text>
        <text class="sub-title">请选择导入方式并填写信息</text>
      </view>

      <view class="type-selector">
        <view
          :class="['type-item', importType === 'pdf' ? 'active' : '']"
          @click="importType = 'pdf'"
          >PDF导入</view
        >
        <view
          :class="['type-item', importType === 'html' ? 'active' : '']"
          @click="importType = 'html'"
          >HTML导入</view
        >
        <view
          :class="['type-item', importType === 'text' ? 'active' : '']"
          @click="importType = 'text'"
          >文本粘贴</view
        >
      </view>

      <view class="form-section">
        <view class="input-item">
          <text class="label">当前学期</text>
          <picker
            @change="onSemesterChange"
            :value="semesterIndex"
            :range="semesters"
          >
            <view class="picker-view">{{ semesters[semesterIndex] }}</view>
          </picker>
        </view>

        <view v-if="importType !== 'text'" class="input-item">
          <text class="label">{{ importType.toUpperCase() }} 文件</text>
          <view class="file-picker" @click="chooseFile">
            <uni-icons
              v-if="!selectedFile"
              type="paperclip"
              size="24"
              color="#999"
            ></uni-icons>
            <text>{{ selectedFile ? selectedFile.name : "点击选择文件" }}</text>
          </view>
        </view>

        <view v-if="importType === 'text'" class="input-item">
          <text class="label">课程表文本内容</text>
          <textarea
            v-model="courseText"
            placeholder="请粘贴从教务系统复制的课程表文字内容..."
            class="text-area"
          ></textarea>
        </view>
      </view>

      <view class="tips-section">
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#ff9800"></uni-icons>
          <text>导入成功后将自动覆盖当前学期的本地课表。</text>
        </view>
      </view>

      <button class="submit-btn" :loading="loading" @click="handleImport">
        确认导入
      </button>
      <text class="back-link" @click="goBack">返回课表</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(false);
const importType = ref("pdf"); // pdf, html, text
const semesters = [
  "2025-2026 第1学期",
  "2025-2026 第2学期",
  "2024-2025 第2学期",
];
const semesterIndex = ref(0);
const selectedFile = ref(null);
const courseText = ref("");

// 后端 API 基础路径
const BASE_URL = "http://localhost:8080/api/v1";

const onSemesterChange = (e) => {
  semesterIndex.value = e.detail.value;
};

const goBack = () => uni.navigateBack();

// 选择文件逻辑 (适配微信小程序/H5)
const chooseFile = () => {
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: 1,
    type: "file",
    extension: importType.value === "pdf" ? [".pdf"] : [".html", ".htm"],
    success: (res) => {
      selectedFile.value = res.tempFiles[0];
    },
  });
  // #endif

  // #ifdef H5 || APP-PLUS
  uni.chooseFile({
    count: 1,
    extension: importType.value === "pdf" ? [".pdf"] : [".html"],
    success: (res) => {
      selectedFile.value = res.tempFiles[0];
    },
  });
  // #endif
};

// 核心导入逻辑
const handleImport = async () => {
  const semester = semesters[semesterIndex.value];
  const token = uni.getStorageSync("token"); // 假设你存了 token

  if (importType.value !== "text" && !selectedFile.value) {
    return uni.showToast({ title: "请选择文件", icon: "none" });
  }
  if (importType.value === "text" && !courseText.value) {
    return uni.showToast({ title: "请粘贴文本内容", icon: "none" });
  }

  loading.value = true;

  try {
    if (importType.value === "text") {
      // 1. 文本导入 - 对应后端 ParseCourseText
      const res = await uni.request({
        url: `${BASE_URL}/course/parse-text`,
        method: "POST",
        header: { Authorization: `Bearer ${token}` },
        data: {
          text: courseText.value,
          semester: semester,
        },
      });
      handleResponse(res[1] || res); // 处理不同版本的 uni.request 返回格式
    } else {
      // 2. 文件导入 (PDF/HTML) - 对应后端 UploadCoursePDF/HTML
      const endpoint =
        importType.value === "pdf" ? "upload-pdf" : "upload-html";
      const fileKey = importType.value === "pdf" ? "pdf" : "html";

      uni.uploadFile({
        url: `${BASE_URL}/course/${endpoint}`,
        filePath: selectedFile.value.path || selectedFile.value.tempFilePath,
        name: fileKey, // 必须与后端 c.FormFile("pdf/html") 对应
        header: { Authorization: `Bearer ${token}` },
        formData: {
          semester: semester,
        },
        success: (uploadRes) => {
          const data = JSON.parse(uploadRes.data);
          handleResponse({ data });
        },
        fail: (err) => {
          uni.showToast({ title: "网络请求失败", icon: "none" });
        },
        complete: () => {
          loading.value = false;
        },
      });
    }
  } catch (e) {
    uni.showToast({ title: "系统错误", icon: "none" });
    loading.value = false;
  }
};

const handleResponse = (res) => {
  loading.value = false;
  // 这里的 code === 200 取决于你 utils.Success 的具体定义
  if (res.data && (res.data.code === 200 || res.data.message === "导入成功")) {
    uni.showToast({
      title: `成功导入 ${res.data.count || 0} 门课程`,
      icon: "success",
    });
    // 等待 toast 显示完毕后再返回，给后端充足的时间处理
    setTimeout(() => {
      uni.navigateBack({
        delta: 1,
      });
      // 使用 setTimeout 再次确保课表页面会重新加载数据
      setTimeout(() => {
        // 触发父页面刷新（如果支持 EventChannel）
        uni.$emit("refreshSchedule");
      }, 100);
    }, 1500);
  } else {
    uni.showToast({ title: res.data.message || "导入失败", icon: "none" });
  }
};
</script>

<style lang="scss">
.import-page {
  min-height: 100vh;
  background-color: #fcfdf7;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 10vh;
}

.type-selector {
  display: flex;
  background: #f1f3f5;
  border-radius: 20rpx;
  padding: 10rpx;
  margin-bottom: 40rpx;
  .type-item {
    flex: 1;
    text-align: center;
    padding: 15rpx 0;
    font-size: 26rpx;
    color: #666;
    transition: all 0.3s;
    &.active {
      background: #fff;
      color: #8bc34a;
      border-radius: 15rpx;
      font-weight: bold;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
    }
  }
}

.auth-card {
  background: #fff;
  border-radius: 40rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
  .title-section {
    margin-bottom: 40rpx;
    .main-title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
    }
    .sub-title {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.input-item {
  margin-bottom: 30rpx;
  .label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 15rpx;
    display: block;
  }
  .picker-view,
  .file-picker {
    background: #f8f9fa;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0 30rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    color: #333;
  }
  .file-picker {
    display: flex;
    align-items: center;
    color: #8bc34a;
    border: 2rpx dashed #dcedc8;
  }
  .text-area {
    background: #f8f9fa;
    width: 100%;
    height: 250rpx;
    border-radius: 16rpx;
    padding: 20rpx;
    font-size: 26rpx;
    box-sizing: border-box;
  }
}

.submit-btn {
  background: #8bc34a;
  color: #fff;
  border-radius: 50rpx;
  height: 90rpx;
  line-height: 90rpx;
  margin-top: 40rpx;
  font-weight: bold;
}
.back-link {
  display: block;
  text-align: center;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #999;
}
.tip-item {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  text {
    font-size: 22rpx;
    color: #ff9800;
    margin-left: 10rpx;
  }
}
</style>