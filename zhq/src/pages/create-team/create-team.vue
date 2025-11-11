<template>
  <view class="page">
    <view class="container">
      <text class="page-title">队伍详情</text>

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
          <common-input
            label="项目内容"
            class="field"
            placeholder="请输入项目内容"
            :multiline="true"
            :required="true"
            v-model:value="form.content"
            :show-word-limit="false"
            :clearable="false"
          />
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

        <view class="buttons">
          <common-button text="取消" type="secondary" @click="onCancel" />
          <common-button text="确定" type="primary" @click="onSubmit" />
        </view>
      </form>
    </view>
  </view>
</template>



<script>
import { CommonInput } from "@/components/Input.vue";
import { CommonSelect } from "@/components/Select.vue";
export default {
  components: {
    CommonInput,
    CommonSelect,
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
      },
      eventOptions: [
        { label: "大学生创新创业比赛", value: "innovation_competition" },
        { label: "挑战杯", value: "challenge_cup" },
        { label: "互联网+", value: "internet_plus" }
      ]
    };
  },
  methods: {
    onEventInput(value) {
      // 处理赛事选择变化
      this.form.event = value;
      console.log('选择的赛事:', value);
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
  height:100vh;
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
  padding: 28rpx 12rpx;
  gap: 24rpx;
  box-sizing: border-box;
}
.event {
  align-items: center;
  margin: 0;
  padding: 28rpx 12rpx;
  gap: 24rpx;
  box-sizing: border-box;
}

/* 多行输入框的行样式 */
.multiline-row {
  padding: 28rpx 12rpx;
  box-sizing: border-box;
  
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


/* 底部操作条位置调整（仍固定）*/
.buttons {
  display: flex;
  gap: 24rpx;
  padding: 40rpx 80rpx;
  justify-content: space-between;
  border: box-sizing;
}


</style>