<!-- /**
 * 通用选择框组件 - 微信风格（基于Input.vue样式）
 * label: 选择框标签（可选）
 * placeholder: 提示文本（可选）
 * value: 选中值（必需）
 * options: 选项数组，格式 [{label: '选项1', value: 'val1'}, ...]（必需）
 * multiple: 是否多选 - false（默认单选）
 * clearable: 是否显示清空按钮 - true（默认）
 * addable: 是否允许用户在下拉框底部添加新选项 - false（默认）
 * required: 是否必填 - false（默认）
 * size: 尺寸 - medium（默认）, small, large
 * borderStyle: 边框风格 - line（默认）, card
 * maxOptions: 多选时最多选择数 - null（无限制）
 */ -->
<template>
  <view
    class="select-wrapper"
    :class="[
      `select-${size}`,
      `border-${borderStyle}`,
      {
        'select-error': hasError,
        'select-focused': isFocused,
        'select-open': isDropdownOpen,
        'select-has-value': hasValue,
      },
    ]"
  >
    <!-- 背景蒙层（用于检测外部点击） -->
    <view
      v-if="isDropdownOpen"
      class="select-mask"
      @click="handleContainerClick"
    />

    <!-- 主要内容区域 -->
    <view class="select-main">
      <!-- 标签 -->
      <view v-if="label" class="select-label">
        <text v-if="required" class="label-required">*</text>
        <text class="label-text">{{ label }}</text>
      </view>

      <!-- 选择框容器 -->
      <view class="select-container" @click="handleSelectClick">
        <!-- 显示选中值 -->
        <text class="select-field" :class="{ 'has-value': displayValue }">
          {{ displayValue || placeholder }}
        </text>

        <!-- 右侧操作区域 -->
        <view class="select-actions">
          <!-- 清空按钮 -->
          <view
            v-if="clearable && hasValue"
            class="action-btn clear-btn"
            @click.stop="handleClear"
          >
            <text class="clear-icon">×</text>
          </view>

          <!-- 下拉箭头 -->
          <view
            class="action-btn arrow-btn"
            :class="{ 'arrow-rotate': isDropdownOpen }"
          >
            <image
              src="@/static/icon/右箭头.svg"
              class="arrow-icon"
              mode="aspectFit"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 下拉框面板 -->
    <view v-if="isDropdownOpen" class="select-dropdown">
      <!-- 选项列表 -->
      <scroll-view
        scroll-y
        class="options-scroll"
        :style="{ maxHeight: dropdownMaxHeight }"
      >
        <view class="options-list">
          <view
            v-for="option in options"
            :key="option.value"
            class="option-item"
            :class="{ 'option-selected': isOptionSelected(option.value) }"
            @click="handleOptionClick(option)"
          >
            <!-- 多选时显示复选框 -->
            <view v-if="multiple" class="checkbox-wrapper">
              <view
                class="checkbox"
                :class="{ 'checkbox-checked': isOptionSelected(option.value) }"
              >
                <text
                  v-if="isOptionSelected(option.value)"
                  class="checkbox-check"
                  >✓</text
                >
              </view>
            </view>

            <!-- 单选时显示单选框 -->
            <view v-else class="radio-wrapper">
              <view
                class="radio"
                :class="{ 'radio-checked': isOptionSelected(option.value) }"
              />
            </view>

            <!-- 选项标签 -->
            <text class="option-label">{{ option.label }}</text>
          </view>

          <!-- 添加新选项按钮 -->
          <view
            v-if="addable && !isAddingOption"
            class="option-item add-option-btn"
            @click="handleAddOptionClick"
          >
            <view class="add-icon">+</view>
            <text class="option-label">添加新选项</text>
          </view>

          <!-- 添加新选项输入框 -->
          <view v-if="addable && isAddingOption" class="add-option-input">
            <input
              v-model="newOptionText"
              class="new-option-input"
              placeholder="输入新选项"
              :focus="isAddingOption"
              @confirm="handleAddNewOption"
              @blur="isAddingOption = false"
            />
            <view class="add-option-actions">
              <view class="add-option-action" @click="handleAddNewOption"
                >确定</view
              >
              <view
                class="add-option-action cancel"
                @click="handleCancelAddOption"
                >取消</view
              >
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部信息区域 -->
    <view v-if="errorMessage" class="select-footer">
      <!-- 错误信息 -->
      <view class="error-message">
        <text class="error-text">{{ errorMessage }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "CommonSelect",
  props: {
    // 选择框标签
    label: {
      type: String,
      default: "",
    },
    // 提示文本
    placeholder: {
      type: String,
      default: "请选择",
    },
    // 选中值（单选为string或number，多选为array）
    // 默认使用空字符串，避免单选时显示默认空数组 `[]`
    value: {
      type: [String, Number, Array],
      default: "",
    },
    // 选项数组
    options: {
      type: Array,
      required: true,
      validator: (value) =>
        Array.isArray(value) &&
        value.every(
          (item) =>
            item.label && item.value !== undefined && item.value !== null
        ),
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否显示清空按钮
    clearable: {
      type: Boolean,
      default: true,
    },
    // 是否允许添加新选项
    addable: {
      type: Boolean,
      default: false,
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    // 尺寸
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },
    // 边框风格
    borderStyle: {
      type: String,
      default: "line",
      validator: (value) => ["line", "card"].includes(value),
    },
    // 多选时最多选择数
    maxOptions: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      isFocused: false,
      isDropdownOpen: false,
      errorMessage: "",
      hasError: false,
      isAddingOption: false,
      newOptionText: "",
      dropdownMaxHeight: "300px",
    };
  },

  computed: {
    // 检查是否有选中值
    hasValue() {
      if (this.multiple) {
        return Array.isArray(this.value) && this.value.length > 0;
      }
      return (
        this.value !== "" && this.value !== null && this.value !== undefined
      );
    },

    // 获取显示文本
    displayValue() {
      if (this.multiple && Array.isArray(this.value)) {
        if (this.value.length === 0) return "";
        if (this.value.length === 1) {
          const option = this.options.find(
            (opt) => opt.value === this.value[0]
          );
          return option ? option.label : this.value[0];
        }
        return `已选择 ${this.value.length} 项`;
      } else if (!this.multiple && this.value) {
        const option = this.options.find((opt) => opt.value === this.value);
        return option ? option.label : this.value;
      }
      return "";
    },
  },

  methods: {
    // 处理选择框点击
    handleSelectClick() {
      this.isFocused = true;
      this.isDropdownOpen = !this.isDropdownOpen;
      this.$emit("focus");
    },

    // 检查选项是否被选中
    isOptionSelected(optionValue) {
      if (this.multiple) {
        return Array.isArray(this.value) && this.value.includes(optionValue);
      }
      return this.value === optionValue;
    },

    // 处理选项点击
    handleOptionClick(option) {
      if (this.multiple) {
        // 多选逻辑
        const newValue = Array.isArray(this.value) ? [...this.value] : [];
        const index = newValue.indexOf(option.value);

        if (index > -1) {
          // 已选中，则取消选择
          newValue.splice(index, 1);
        } else {
          // 未选中，则选择
          if (this.maxOptions === null || newValue.length < this.maxOptions) {
            newValue.push(option.value);
          } else {
            this.setError(`最多只能选择 ${this.maxOptions} 项`);
            return;
          }
        }

        this.$emit("input", newValue);
        this.$emit("update:value", newValue);
        this.$emit("change", newValue);
      } else {
        // 单选逻辑
        this.$emit("input", option.value);
        this.$emit("update:value", option.value);
        this.$emit("change", option.value);
        this.isDropdownOpen = false;
      }

      this.clearError();
    },

    // 处理清空
    handleClear() {
      const emptyValue = this.multiple ? [] : "";
      this.$emit("input", emptyValue);
      this.$emit("update:value", emptyValue);
      this.$emit("clear");
      this.clearError();
    },

    // 处理点击"添加新选项"按钮
    handleAddOptionClick() {
      this.isAddingOption = true;
      this.newOptionText = "";
      // 小程序环境下不支持querySelector，移除focus操作
      // 在小程序中，input会自动获得焦点
    },

    // 处理添加新选项
    handleAddNewOption() {
      if (this.newOptionText.trim() === "") {
        this.setError("选项名称不能为空");
        return;
      }

      // 检查重复
      if (this.options.some((opt) => opt.label === this.newOptionText.trim())) {
        this.setError("该选项已存在");
        return;
      }

      const newOption = {
        label: this.newOptionText.trim(),
        value: `custom_${Date.now()}_${Math.random()}`,
      };

      // 向options中添加新选项
      this.$emit("option-added", newOption);

      // 如果组件的options使用了.sync或v-model，需要在父组件中处理
      // 这里通过事件发射给父组件处理

      this.isAddingOption = false;
      this.newOptionText = "";
      this.clearError();
    },

    // 处理取消添加选项
    handleCancelAddOption() {
      this.isAddingOption = false;
      this.newOptionText = "";
      this.clearError();
    },

    // 设置错误信息
    setError(message) {
      this.errorMessage = message;
      this.hasError = true;
    },

    // 清除错误信息
    clearError() {
      this.errorMessage = "";
      this.hasError = false;
    },

    // 外部调用的验证方法
    validate() {
      if (this.required) {
        if (!this.hasValue) {
          this.setError(`${this.label || "此项"}不能为空`);
          return false;
        }
      }
      this.clearError();
      return true;
    },

    // 处理容器点击事件，用于关闭下拉框
    handleContainerClick() {
      // 如果下拉框打开，则关闭
      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
        this.isFocused = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
// 背景蒙层（用于外部点击关闭）
.select-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.select-wrapper {
  margin-bottom: 16px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;

  // 尺寸样式
  &.select-small .select-container {
    height: 36px;
    .select-field {
      font-size: 13px;
    }
  }

  &.select-medium .select-container {
    height: 44px;
    .select-field {
      font-size: 14px;
    }
  }

  &.select-large .select-container {
    height: 52px;
    .select-field {
      font-size: 16px;
    }
  }

  // 边框风格
  &.border-line .select-main {
    border: none;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 0;
    background: transparent;
  }

  &.border-line .select-container {
    border: none;
    background: transparent;
  }

  &.border-card .select-container {
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    background: #fafafa;
  }

  // 状态样式
  &.select-error .select-container {
    border-color: $uni-color-error;
  }
}

.select-main {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.select-label {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 80px;
  margin-bottom: 0;

  .label-text {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }

  .label-required {
    color: $uni-color-error;
    margin-right: 2px;
    font-size: 14px;
  }
}

.select-container {
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: relative;
  flex: 1;
  width: 0;
  min-width: 0;
  transition: all 0.2s ease;
}

.select-field {
  flex: 1;
  color: #c7c7c7;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.has-value {
    color: #333333;
  }
}

.select-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  .clear-icon {
    font-size: 18px;
    color: #c7c7c7;
    transition: color 0.2s ease;
    font-weight: 300;
    line-height: 1;
  }

  &:active .clear-icon {
    color: #999999;
  }
}

.arrow-btn {
  transition: transform 0.3s ease;

  &.arrow-rotate {
    transform: rotate(90deg);
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
    color: #c7c7c7;
  }
}

// 下拉框样式
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 100%;
  animation: dropdownSlideIn 0.2s ease;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.options-scroll {
  width: 100%;
  box-sizing: border-box;
}

.options-list {
  width: 100%;
  box-sizing: border-box;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  min-height: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f9f9f9;
  }

  &.option-selected {
    background-color: #f0f8ff;
  }

  &.add-option-btn {
    color: $uni-color-primary;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    min-height: 20px;

    &:active {
      background-color: #f9f9f9;
    }
  }
}

.checkbox-wrapper,
.radio-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.checkbox {
  width: 14px;
  height: 14px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.checkbox-checked {
    background-color: $uni-color-primary;
    border-color: $uni-color-primary;

    .checkbox-check {
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }
}

.radio {
  width: 14px;
  height: 14px;
  border: 1px solid #d8d8d8;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: relative;

  &.radio-checked {
    border-color: $uni-color-primary;

    &::after {
      content: "";
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: $uni-color-primary;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.option-label {
  font-size: 14px;
  color: #333333;
  flex: 1;
}

.add-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: $uni-color-primary;
  margin-right: 8px;
}

// 添加新选项输入框样式
.add-option-input {
  padding: 12px 14px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  align-items: center;

  .new-option-input {
    flex: 1;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 13px;

    &:focus {
      border-color: $uni-color-primary;
    }
  }
}

.add-option-actions {
  display: flex;
  gap: 4px;
}

.add-option-action {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  transition: all 0.2s ease;
  background-color: $uni-color-primary;
  color: white;

  &:active {
    opacity: 0.8;
  }

  &.cancel {
    background-color: #e5e5e5;
    color: #333333;
  }
}

.select-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 6px;
  min-height: 20px;
}

.error-message {
  .error-text {
    font-size: 12px;
    color: $uni-color-error;
  }
}
</style>
