<template>
  <view class="resume-container">
    <!-- 页面标题 -->
    <view class="page-title">我的简历</view>
    <!-- 简历列表 -->
    <view class="resume-list">
      <view
        class="resume-item"
        v-for="(item, index) in resumeList"
        :key="index"
      >
        <view class="resume-content">
          <!-- 图标 -->
          <view class="resume-icon">
            <text class="iconfont icon-wodejianli"></text>
          </view>
          <!-- 简历信息 -->
          <view class="resume-info">
            <view class="resume-title">{{ item.title }}</view>
            <view class="resume-date">{{ item.updateTime }}更新</view>
          </view>
        </view>

        <!-- 默认按钮 -->
        <view class="default-badge">默认投递</view>
      </view>
    </view>

    <!-- 上传方式选择 -->
    <view class="upload-section">
      <view class="section-title">请选择上传方式</view>
      <view class="section-tip"
        >建议选用使用PDF文件,支持doc,docx,jpg,png格式,大小不超过20M</view
      >

      <!-- 微信上传按钮 -->
      <view class="upload-btn wechat-btn" @click="uploadFromWechat">
        <view class="btn-icon wechat-icon">
          <i class="iconfont icon-weixin"></i>
        </view>
        <view class="btn-text">从微信聊天中上传</view>
      </view>

      <!-- 本地上传按钮 -->
      <view class="upload-btn local-btn" @click="uploadFromLocal">
        <view class="btn-icon local-icon">
          <text class="iconfont icon-bendi"></text>
        </view>
        <view class="btn-text">从本地上传</view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from "@/utils/index.js"; // 导入api对象
export default {
  data() {
    return {
      resumeList: [
        {
          title: "在线简历",
          updateTime: "2025/11/12",
        },
      ],
    };
  },

  methods: {
    // 从微信聊天中上传（选择聊天会话）
    uploadFromWechat() {
      // #ifdef MP-WEIXIN
      uni.chooseMessageFile({
        count: 1,
        type: "file",
        extension: [".pdf", ".doc", ".docx", ".jpg", ".png"],
        sourceType: ["chat"], // 仅从聊天选择
        success: (res) => {
          const file = res.tempFiles && res.tempFiles[0];
          if (!file) {
            uni.showToast({ title: "未选择文件", icon: "none" });
            return;
          }
          this.handleUpload(file);
        },
        fail: (err) => {
          if (err && err.errMsg && err.errMsg.indexOf("cancel") === -1) {
            uni.showToast({ title: "选择文件失败", icon: "none" });
            console.error("选择文件失败", err);
          }
        },
      });
      // #endif

      // #ifndef MP-WEIXIN
      uni.showToast({
        title: "仅支持微信小程序",
        icon: "none",
      });
      // #endif
    },

    // 从本地上传（直接打开系统文件管理器/相册）
    uploadFromLocal() {
      // #ifdef MP-WEIXIN
      // 使用 wx.chooseMedia 直接打开系统相册/文件选择器
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"], // 支持图片
        sourceType: ["album", "camera"], // 从相册选择或拍照
        maxDuration: 30,
        camera: "back",
        success: (res) => {
          const media = res.tempFiles[0];
          if (!media) {
            uni.showToast({ title: "未选择文件", icon: "none" });
            return;
          }

          // 构造文件对象
          const file = {
            path: media.tempFilePath,
            tempFilePath: media.tempFilePath,
            size: media.size,
            name: `image_${Date.now()}.${media.fileType || "jpg"}`,
            type: media.fileType,
          };

          this.handleUpload(file);
        },
        fail: (err) => {
          if (err && err.errMsg && err.errMsg.indexOf("cancel") === -1) {
            // 如果 chooseMedia 失败，降级使用 chooseImage
            this.fallbackChooseImage();
          }
        },
      });
      // #endif

      // #ifdef H5
      // H5：使用 input file
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.jpg,.png,image/*";
      input.onchange = (e) => {
        const f = e.target.files[0];
        if (f) {
          this.handleUpload({
            path: URL.createObjectURL(f),
            size: f.size,
            name: f.name,
            file: f,
          });
        }
      };
      input.click();
      // #endif

      // #ifdef APP-PLUS
      // App：使用 plus.io 打开文件选择器
      plus.gallery.pick(
        (file) => {
          this.handleUpload({
            path: file,
            tempFilePath: file,
            name: file.substring(file.lastIndexOf("/") + 1),
          });
        },
        (err) => {
          console.error("选择文件失败", err);
        },
        {
          filter: "image",
          multiple: false,
        }
      );
      // #endif

      // #ifndef MP-WEIXIN || H5 || APP-PLUS
      uni.showToast({
        title: "当前平台暂不支持",
        icon: "none",
      });
      // #endif
    },

    // 降级方案：使用 chooseImage
    fallbackChooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];

          uni.getImageInfo({
            src: tempFilePath,
            success: (info) => {
              const file = {
                path: tempFilePath,
                tempFilePath: tempFilePath,
                size: info.width * info.height * 4,
                name: `image_${Date.now()}.jpg`,
                type: "image/jpeg",
              };
              this.handleUpload(file);
            },
            fail: () => {
              const file = {
                path: tempFilePath,
                tempFilePath: tempFilePath,
                name: `image_${Date.now()}.jpg`,
              };
              this.handleUpload(file);
            },
          });
        },
      });
    },

    // 处理文件上传
    handleUpload(file) {
      console.log("准备上传文件:", file);

      // 检查文件大小
      if (file.size && file.size > 20 * 1024 * 1024) {
        uni.showToast({
          title: "文件大小不能超过20M",
          icon: "none",
        });
        return;
      }

      uni.showLoading({
        title: "上传中...",
      });

      // 上传文件到服务器
      uni.uploadFile({
        url: "http://localhost:8080/api/v1/resumes/upload", // 替换为你的上传接口
        filePath: file.path || file.tempFilePath || "",
        name: "file",
        formData: {
          fileName: file.name || "简历文件",
          fileSize: file.size || 0,
        },
        success: (uploadRes) => {
          uni.hideLoading();
          console.log("上传成功:", uploadRes);
          uni.showToast({
            title: "上传成功",
            icon: "success",
          });
          // 刷新简历列表
          this.getResumeList();
        },
        fail: (err) => {
          uni.hideLoading();
          console.error("上传失败:", err);
          uni.showToast({
            title: "上传失败",
            icon: "none",
          });
        },
      });
    },

    // 获取简历列表
    getResumeList() {
      // 调用接口获取简历列表
    },
  },
  // 处理文件上传
  handleUpload(file) {
    console.log("准备上传文件:", file);

    // 检查文件大小
    if (file.size && file.size > 20 * 1024 * 1024) {
      uni.showToast({
        title: "文件大小不能超过20M",
        icon: "none",
      });
      return;
    }

    uni.showLoading({
      title: "上传中...",
    });

    // 上传文件到服务器（使用接口地址）
    uni.uploadFile({
      url: `${request.baseURL}/api/v1/resumes/upload`, // 使用baseURL和接口路径
      filePath: file.path || file.tempFilePath || "",
      name: "file",
      formData: {
        fileName: file.name || "简历文件",
        fileSize: file.size || 0,
      },
      header: {
        Authorization: `Bearer ${uni.getStorageSync("token")}`, // 携带token
      },
      success: (uploadRes) => {
        uni.hideLoading();
        console.log("上传成功:", uploadRes);
        uni.showToast({
          title: "上传成功",
          icon: "success",
        });
        // 刷新简历列表
        this.getResumeList();
      },
      fail: (err) => {
        uni.hideLoading();
        console.error("上传失败:", err);
        uni.showToast({
          title: "上传失败",
          icon: "none",
        });
      },
    });
  },

  // 获取简历列表
  async getResumeList() {
    try {
      const res = await api.getResumeList();
      this.resumeList = res.data || []; // 假设接口返回格式为 { data: [...] }
    } catch (err) {
      console.error("获取简历列表失败:", err);
      uni.showToast({
        title: "获取简历失败",
        icon: "none",
      });
    }
  },

  // 新增：删除简历
  async deleteResume(id) {
    try {
      await api.deleteResume(id);
      uni.showToast({
        title: "删除成功",
        icon: "success",
      });
      this.getResumeList(); // 重新获取列表
    } catch (err) {
      console.error("删除简历失败:", err);
      uni.showToast({
        title: "删除失败",
        icon: "none",
      });
    }
  },

  // 新增：设置默认简历
  async setDefaultResume(id) {
    try {
      await api.setDefaultResume(id);
      uni.showToast({
        title: "设置默认成功",
        icon: "success",
      });
      this.getResumeList(); // 重新获取列表
    } catch (err) {
      console.error("设置默认简历失败:", err);
      uni.showToast({
        title: "设置失败",
        icon: "none",
      });
    }
  },
  onLoad() {
    this.getResumeList();
  },
};
</script>

<style lang="scss" scoped>
.resume-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0 30rpx;
}

.page-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  padding: 40rpx 0 30rpx;
}

.resume-list {
  margin-bottom: 60rpx;
}

.resume-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.resume-content {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.resume-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;

  .iconfont {
    font-size: 70rpx;
    color: #666666 !important;
  }
}

.resume-info {
  flex: 1;
}

.resume-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.resume-date {
  font-size: 24rpx;
  color: #999;
}

.default-badge {
  display: inline-block;
  padding: 8rpx 24rpx;
  background-color: #f5f5f5;
  color: #666;
  font-size: 24rpx;
  border-radius: 8rpx;
}

.upload-section {
  margin-top: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.section-tip {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 40rpx;
  line-height: 1.6;
}

.upload-btn {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  border: 2rpx solid #e5e5e5;
  transition: all 0.3s;

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.btn-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.wechat-icon {
  .iconfont {
    font-size: 70rpx;
    color: #09bb07 !important;
  }
}

.local-icon {
  .iconfont {
    font-size: 70rpx;
    color: #666666 !important;
  }
}

.btn-text {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}
</style>