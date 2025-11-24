<template>
  <view class="editor-page">
    <!-- 顶部导航栏（保持微信风格） -->
    <view class="editor-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">←</text>
        <text class="header-title">编辑内容</text>
      </view>
      <view class="header-right" @click="saveContent">
        <text class="save-text">保存</text>
      </view>
    </view>

    <!-- 输入区域 + 底部工具栏（模拟微信输入格式） -->
    <view class="editor-wrap">
      <!-- 输入框 placeholder -->
      <view class="editor-placeholder" v-if="!richContent">请输入...</view>
      <!-- 富文本编辑区域 -->
      <editor
        class="editor-content"
        id="editor"
        :read-only="false"
        @input="onInput"
        @ready="onEditorReady"
      ></editor>
    </view>

    <!-- 底部工具栏（模拟微信输入键盘样式） -->
    <view class="wechat-toolbar">
      <!-- 格式工具 -->
      <view class="tool-group">
        <button class="tool-btn" @click="format('bold')">
          <text class="tool-icon">B</text>
        </button>
        <button class="tool-btn" @click="format('italic')">
          <text class="tool-icon">I</text>
        </button>
        <button class="tool-btn" @click="format('underline')">
          <text class="tool-icon">U</text>
        </button>
      </view>
      <!-- 功能工具（简化为图片插入） -->
      <view class="tool-group">
        <button class="tool-btn" @click="insertImage">
          <text class="tool-icon">🖼</text>
        </button>
      </view>
      <!-- 字数统计 -->
      <view class="word-count">
        <text>{{ wordCount }} / 5000</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      richContent: "", // 富文本内容（HTML格式）
      wordCount: 0, // 字数统计
      editorCtx: null, // editor上下文
      initialContent: "", // 初始化内容暂存
    };
  },
  onLoad(options) {
    // 接收初始内容（支持HTML格式）
    if (options.content) {
      this.initialContent = decodeURIComponent(options.content);
    }
  },
  methods: {
    // 初始化editor上下文
    onEditorReady() {
      const that = this;
      wx.createSelectorQuery()
        .select("#editor")
        .context(function (res) {
          that.editorCtx = res.context;
          // 初始化内容（如果有）
          if (that.initialContent) {
            that.editorCtx.setContents({
              html: that.initialContent,
              success() {
                that.wordCount = that.calculateWordCount(that.initialContent);
              },
            });
          }
        })
        .exec();
    },

    // 格式化文本（加粗/斜体等）
    format(command) {
      this.editorCtx.format(command);
    },

    // 插入图片
    insertImage() {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          that.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            alt: "图片",
            success() {
              console.log("图片插入成功");
            },
          });
        },
      });
    },

    // 监听输入变化
    onInput(e) {
      this.richContent = e.detail.html;
      this.wordCount = this.calculateWordCount(this.richContent);

      // 限制最大字数
      if (this.wordCount > 5000) {
        this.editorCtx.setContents({
          html: this.richContent.substring(0, 5000),
        });
        wx.showToast({
          title: "内容不能超过5000字",
          icon: "none",
        });
      }
    },

    // 计算纯文本字数（过滤HTML标签）
    calculateWordCount(html) {
      const text = html.replace(/<[^>]+>/g, ""); // 移除HTML标签
      return text.length;
    },

    // 返回上一页
    goBack() {
      wx.navigateBack({ delta: 1 });
    },

    // 保存内容并返回
    saveContent() {
      if (this.wordCount > 5000) {
        wx.showToast({
          title: "内容不能超过5000字",
          icon: "none",
        });
        return;
      }

      // 传递富文本内容
      uni.$emit("contentEdited", {
        content: this.richContent,
      });
      wx.navigateBack({ delta: 1 });
    },
  },
};
</script>
<style scoped>
/* 页面容器 */
.editor-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
}

/* 导航栏（保持微信风格） */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #f7f7f7;
  border-bottom: 1rpx solid #e5e5e5;
}

.header-left {
  display: flex;
  align-items: center;
  color: #000000;
}

.back-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 500;
}

.header-right {
  color: #07c160;
  font-size: 30rpx;
  padding: 8rpx 16rpx;
}

/* 编辑区域 + placeholder */
.editor-wrap {
  flex: 1;
  padding: 24rpx;
  position: relative;
}

.editor-placeholder {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  font-size: 30rpx;
  color: #c9c9c9;
  pointer-events: none;
}

.editor-content {
  width: 100%;
  min-height: 200rpx;
  font-size: 30rpx;
  line-height: 1.6;
  background-color: #ffffff;
}

/* 底部工具栏（模拟微信输入键盘） */
.wechat-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-top: 1rpx solid #e5e5e5;
}

.tool-group {
  display: flex;
}

.tool-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  margin-right: 12rpx;
  font-size: 28rpx;
}

.tool-btn:active {
  background-color: #f0f0f0;
}

.word-count {
  font-size: 26rpx;
  color: #888888;
}
</style>