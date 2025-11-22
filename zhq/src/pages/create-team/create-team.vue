<template>
  <view class="page">
    <view class="container">
      <!-- 新增导航栏区域 -->
      <view class="navbar">
        <!-- 返回键 -->
        <view class="back-btn" @click="onCancel">
          <image
            src="@/static/icon/左箭头.svg"
            class="back-icon"
            mode="aspectFit"
          />
        </view>
        <!-- 创建按钮 -->
        <view class="create-btn" @click="checkFormAndSubmit">创建</view>
      </view>

      <form class="form" @submit.prevent="onSubmit">
        <view class="row">
          <common-input
            label="队伍名称"
            class="field"
            placeholder="请输入队伍名称"
            v-model="form.name"
            :required="true"
            @input="onUsernameInput"
          />
        </view>
        <view class="event">
          <common-select
            label="相关赛事"
            class="field"
            placeholder="请选择您要参加的比赛"
            :options="eventOptions"
            :value="form.event"
            :addable="true"
            :required="true"
            @input="onEventInput"
            @option-added="handleAddEvent"
          />
        </view>
        <view class="multiline-row">
          <!-- 项目内容输入框：添加点击事件和只读属性，不改动样式 -->
          <common-input
            label="项目内容"
            class="field"
            placeholder="请输入项目内容"
            :multiline="true"
            :required="true"
            v-model:value="form.content"
            :show-word-limit="false"
            :clearable="false"
            @focus.prevent="openContentEditor"
            @input.prevent=""
            @touchstart="openContentEditor"
            @click="openContentEditor"
          />
          <!-- 编辑器入口箭头 -->
          <view class="arrow-btn" @click="openContentEditor">
            <image
              src="@/static/icon/右箭头.svg"
              class="arrow-icon"
              mode="aspectFit"
            />
          </view>
        </view>

        <view class="row">
          <common-input
            label="招募人数"
            class="field"
            placeholder="请输入招募人数"
            v-model="form.recruitNumber"
            :required="true"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="所需技能"
            class="field"
            placeholder="示例:Python・机器学习・团队协作"
            v-model="form.skills"
            :required="true"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="项目周期"
            class="field"
            placeholder="请输入项目周期"
            v-model="form.period"
            :required="true"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="预期成果"
            class="field"
            placeholder="请输入预期成果"
            v-model="form.outcome"
            :required="true"
            @input="onUsernameInput"
          />
        </view>
        <view class="row">
          <view class="image-upload">
            <view class="upload-btn" @click="chooseImage">
              <view class="add-icon">+</view>
              <text class="upload-text">可点击上传项目相关图片</text>
            </view>
            <view class="image-list">
              <view
                v-for="(img, index) in form.images"
                :key="index"
                class="image-item"
              >
                <image :src="img" class="uploaded-image" mode="aspectFill" />
                <view class="delete-img" @click="deleteImage(index)">×</view>
              </view>
            </view>
          </view>
        </view>
      </form>

      <!-- 左下角标签栏（固定位置，不与按钮重合） -->
      <view class="tag-corner">
        <!-- 替换原标签逻辑为TagsInput组件 -->
        <TagsInput v-model="form.tags" />
      </view>
    </view>
  </view>
</template>



<script>
import { CommonInput } from "@/components/Input.vue";
import { CommonSelect } from "@/components/Select.vue";
import TagsInput from "@/components/TagsInput.vue";
export default {
  components: {
    CommonInput,
    CommonSelect,
    TagsInput,
  },
  data() {
    return {
      form: {
        name: "",
        event: "",
        eventIndex: 0,
        content: "",
        recruitNumber: "",
        skills: "",
        period: "",
        outcome: "",
        city: "",
        tags: [],
        images: [],
      },
      eventOptions: [
        { label: "大学生创新创业比赛", value: "innovation_competition" },
        { label: "挑战杯", value: "challenge_cup" },
        { label: "互联网+", value: "internet_plus" },
      ],
      eventTagMap: {
        innovation_competition: ["创业", "产品"],
        challenge_cup: ["科技", "创新"],
        internet_plus: ["互联网", "前端"],
      },
      newTagText: "",
    };
  },
  onLoad() {
    // 监听编辑器返回的内容
    uni.$on("contentEdited", (data) => {
      if (data && data.content !== undefined) {
        this.form.content = data.content;
      }
    });
  },
  onUnload() {
    // 页面卸载时移除监听
    uni.$off("contentEdited");
  },
  methods: {
    onEventInput(value) {
      // 处理赛事选择变化
      this.form.event = value;
      // 自动生成标签
      const recommendedTags = this.eventTagMap[value] || [];
      recommendedTags.forEach((tag) => {
        if (!this.form.tags.includes(tag)) {
          this.form.tags.push(tag);
        }
      });
      console.log("选择的赛事:", value);
    },
    openContentEditor() {
      // 跳转到富文本编辑器
      uni.navigateTo({
        url:
          "/pages/editor/editor?content=" +
          encodeURIComponent(this.form.content),
      });
    },
    handleAddEvent(newOption) {
      // 处理用户添加的新赛事选项
      this.eventOptions.push(newOption);
      // 自动选择新添加的选项
      this.form.event = newOption.value;
    },
    onEventChange(e) {
      this.form.eventIndex = e.detail.value;
    },
    onCancel() {
      if (typeof uni !== "undefined" && uni.navigateBack) {
        uni.navigateBack();
      }
    },
    onSubmit() {
      // 提交逻辑
      // 基础校验示例
      if (!this.form.name) {
        uni.showToast({ title: "请填写队伍名称", icon: "none" });
        return;
      }
      console.log("提交表单：", this.form);
      uni.showToast({ title: "提交成功", icon: "success" });
    },
    chooseImage() {
      uni.chooseImage({
        count: 3, // 可根据需求调整上传数量
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.form.images = this.form.images.concat(res.tempFilePaths);
        },
      });
    },
    deleteImage(index) {
      this.form.images.splice(index, 1);
    },
    checkFormAndSubmit() {
      const { name, event, content, recruitNumber, skills, period, outcome } =
        this.form;
      if (!name) {
        uni.showToast({ title: "请填写队伍名称", icon: "none" });
        return;
      }
      if (!event) {
        uni.showToast({ title: "请选择相关赛事", icon: "none" });
        return;
      }
      if (!content) {
        uni.showToast({ title: "请填写项目内容", icon: "none" });
        return;
      }
      if (!recruitNumber) {
        uni.showToast({ title: "请填写招募人数", icon: "none" });
        return;
      }
      if (!skills) {
        uni.showToast({ title: "请填写所需技能", icon: "none" });
        return;
      }
      if (!period) {
        uni.showToast({ title: "请填写项目周期", icon: "none" });
        return;
      }
      if (!outcome) {
        uni.showToast({ title: "请填写预期成果", icon: "none" });
        return;
      }
      // 所有字段校验通过，执行提交
      this.onSubmit();
    },
    onUsernameInput() {
      // 原输入监听方法，保持不变
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  background: linear-gradient(#eaf4ff, #f6f7fb);
  min-height: 100vh;
  box-sizing: border-box;
  font-family: -apple-system, "Helvetica Neue", "PingFang SC", "Microsoft YaHei",
    Arial;
}

/* 容器改为填充整个页面 */
.container {
  width: 100%;
  height: 100vh;
  margin: 0;
  background: #fff;
  border: none;
  box-sizing: border-box;
  position: relative;
}

/* 标题向上对齐，保留视觉层次 */
.page-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #2a2a2a;
  margin: 20rpx;
}

.row {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 25rpx 12rpx;
  gap: 24rpx;
  box-sizing: border-box;
}
.event {
  align-items: center;
  margin: 0;
  padding: 25rpx 12rpx;
  gap: 24rpx;
  box-sizing: border-box;
}

/* 多行输入框的行样式 */
.multiline-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 25rpx 12rpx 0 12rpx;
  box-sizing: border-box;
  width: 100%;

  .field {
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
}

/* 箭头按钮样式（与Select.vue一致） */
.arrow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.arrow-btn:active {
  opacity: 0.7;
}

.arrow-icon {
  width: 28rpx;
  height: 28rpx;
  margin-left: -90rpx;
  margin-bottom: 50rpx;
}

.field {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  padding: 0 24rpx;
  color: #666;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

/* 左下角标签栏（固定位置） */
.tag-corner {
  position: fixed;
  bottom: 0rpx;
  left: 20rpx;
  z-index: 99;
  max-width: calc(100% - 40rpx);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.tag-item {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8rpx;
  background: #e4eef4;
  height: 40rpx;
  max-width: 600rpx;
  gap: 0;
}

.tag-icon {
  padding-left: 22rpx;
  padding-right: 10rpx;
  padding-top: 5rpx;
  font-weight: bold;
  color: #084e8a;
}

.tag-text {
  padding-left: 0;
  padding-right: 10rpx;
  padding-top: 5rpx;
  font-weight: bold;
  color: #084e8a;
  max-width: 550rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-delete {
  font-size: 28rpx;
  color: #084e8a;
  font-weight: bold;
  cursor: pointer;
  padding: 0 12rpx 0 0;
  line-height: 1;
}

.tag-input-row {
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.tag-input {
  flex: 1;
  min-width: 120rpx;
  height: 40rpx;
  padding: 0 10rpx;
  border: 1rpx solid #d9d9d9;
  border-radius: 6rpx;
  font-size: 24rpx;
  box-sizing: border-box;
  background: #fff;
}

.tag-add-btn {
  min-width: 70rpx;
  height: 40rpx;
  background: #1890ff;
  color: #fff;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  cursor: pointer;
  white-space: nowrap;
}
.image-upload {
  width: 760rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding-left: 50rpx;

  .upload-btn {
    display: flex;
    align-items: center;
    gap: 12rpx;
    cursor: pointer;

    .add-icon {
      width: 180rpx;
      height: 180rpx;
      background: #f2f2f2;
      color: #cbcbcb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60rpx;
    }

    .upload-text {
      color: #999;
      font-size: 28rpx;
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .image-item {
    position: relative;
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    overflow: hidden;

    .uploaded-image {
      width: 100%;
      height: 100%;
    }

    .delete-img {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      width: 30rpx;
      height: 30rpx;
      border-radius: 50%;
      background: #ff4d4f;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      cursor: pointer;
    }
  }
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  width: 100%;
}
.back-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
}
</style>