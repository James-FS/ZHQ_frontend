<template>
  <view class="page-wrapper">
    <view class="title">
      <text class="back" @click="goBack">＜</text>
      <text class="title-text">信息填写</text>
      <button class="save" :disabled="!isDirty" @click="save">保存</button>
    </view>
    <textarea
      class="input"
      v-model="signature"
      maxlength="30"
      @input="handleInput"
      placeholder="请输入"
    ></textarea>
    <text class="word-count">{{ signature.length }}/30</text>
  </view>
</template>
<script>
export default {
  data() {
    return {
      signature: "",
      isDirty: false, // 标记是否修改
    };
  },
  // signature-edit.vue 的 onLoad 修正（接收当前字段值）
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("signatureData", (data) => {
      // 接收个人资料页传递的当前字段值（如 name 的现有值）
      this.signature = data.currentValue || "";
    });
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    handleInput() {
      this.isDirty = true;
    },
    // save 方法保持不变（传回新值）
    save() {
      uni.showToast({ title: "保存成功", icon: "success" });
      const eventChannel = this.getOpenerEventChannel();
      // 将编辑后的内容传回个人资料页
      eventChannel.emit("signatureSaved", { signature: this.signature });
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss"  scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  margin-bottom: 30rpx;
}
.back {
  display: flex;
  font-size: 40rpx;
  color: #333;
}
.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.save {
  font-size: 28rpx;
  color: #fff;
  background: #07c160;
  border-radius: 40rpx;
  padding: 10rpx 30rpx;
  margin-right: 20rpx;
}
.input {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  line-height: 1.5;
}
.word-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}
</style>
