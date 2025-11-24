<!-- /**
 * 通用输入框组件 - 微信风格
 * label: 输入框标签（可选）
 * placeholder: 提示文本（可选）
 * value: 输入值（必需）
 * type: 输入类型 - text（默认）, password, number, tel, email
 * disabled: 是否禁用 - false（默认）
 * readonly: 是否只读 - false（默认）
 * clearable: 是否显示清空按钮 - true（默认）
 * showPassword: 是否显示密码切换按钮（type为password时有效） - true（默认）
 * maxlength: 最大输入长度（可选）
 * showWordLimit: 是否显示字数统计 - false（默认）
 * required: 是否必填 - false（默认）
 * validateOnBlur: 失焦时是否验证 - true（默认）
 * rules: 验证规则数组（可选）
 * size: 尺寸 - medium（默认）, small, large
 * borderStyle: 边框风格 - line（默认）, card
 * multiline: 是否多行显示 - false（默认）
 */ -->
<template>
  <view class="input-wrapper" :class="[
    `input-${size}`,
    `border-${borderStyle}`,
    {
      'input-disabled': disabled,
      'input-readonly': readonly,
      'input-error': hasError,
      'input-focused': isFocused,
      'input-multiline': shouldUseMultiline
    }
  ]">
    <!-- 主要内容区域 - 标签和输入框在同一行 -->
    <view class="input-main">
      <!-- 标签 -->
      <view v-if="label" class="input-label">
        <text v-if="required" class="label-required">*</text>
        <text class="label-text">{{ label }}</text>
      </view>
      
      <!-- 输入框容器 -->
      <view class="input-container">
      <!-- 只读状态：使用text显示 -->
      <text 
        v-if="readonly"
        class="input-field readonly-text"
        :class="{ 'has-value': value }"
      >{{ value || placeholder }}</text>
      
      <!-- 多行输入框 -->
      <textarea
        v-else-if="shouldUseMultiline"
        class="input-field textarea-field"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :auto-height="true"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
        @linechange="handleLineChange"
      />
      
      <!-- 正常状态：使用input -->
      <input
        v-else
        class="input-field"
        :type="currentInputType"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
      />
      
      <!-- 右侧操作区域 -->
      <view class="input-actions">
        <!-- 清空按钮 -->
        <view 
          v-if="clearable && value && !disabled && !readonly"
          class="action-btn clear-btn"
          @click="handleClear"
        >
          <text class="clear-icon">×</text>
        </view>
        
        <!-- 密码显示切换按钮(单行时才显示) -->
        <view 
          v-if="!multiline && type === 'password' && showPassword"
          class="action-btn password-btn"
          @click="togglePasswordVisibility"
        >
          <text class="eye-icon">{{ isPasswordVisible ?'👁️' : '👁️‍🗨️' }}</text>
        </view>
        
        <!-- 右侧箭头 -->
        <view
          v-if="showArrow"
          class="action-btn arrow-btn"
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
    
    <!-- 底部信息区域 -->
    <view v-if="showWordLimit || errorMessage" class="input-footer">
      <!-- 字数统计 -->
      <view v-if="showWordLimit && maxlength" class="word-count">
        <text class="count-text">{{ currentLength }}/{{ maxlength }}</text>
      </view>
      
      <!-- 错误信息 -->
      <view v-if="errorMessage" class="error-message">
        <text class="error-text">{{ errorMessage }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommonInput',
  props: {
    // 输入框标签
    label: {
      type: String,
      default: ''
    },
    // 提示文本
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    // 输入值
    value: {
      type: [String, Number],
      default: ''
    },
    // 输入类型
    type: {
      type: String,
      default: 'text',
      validator: value => ['text', 'password', 'number', 'tel', 'email'].includes(value)
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否显示清空按钮
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否显示密码切换按钮
    showPassword: {
      type: Boolean,
      default: true
    },
    // 是否显示右侧箭头
    showArrow: {
      type: Boolean,
      default: false
    },
    // 最大输入长度
    maxlength: {
      type: Number,
      default: 200
    },
    // 是否显示字数统计
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false
    },
    // 失焦时是否验证
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    // 验证规则
    rules: {
      type: Array,
      default: () => []
    },
    // 尺寸
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    // 边框风格
    borderStyle: {
      type: String,
      default: 'line',
      validator: value => ['line', 'card'].includes(value)
    },
    // 是否多行显示
    multiline: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      isFocused: false,
      isPasswordVisible: false,
      errorMessage: '',
      hasError: false
    }
  },
  
  computed: {
    currentInputType() {
      if (this.type === 'password') {
        return this.isPasswordVisible ? 'text' : 'password'
      }
      return this.type
    },
    
    // 判断是否应该使用多行输入
    shouldUseMultiline() {
      return this.multiline && this.type !== 'password'
    },
    
    currentLength() {
      return String(this.value).length
    }
  },
  
  methods: {
    handleInput(e) {
      const value = e.detail.value
      this.clearError()
      this.$emit('input', value)
      this.$emit('update:value', value)
    },
    
    handleFocus(e) {
      this.isFocused = true
      this.$emit('focus', e)
    },
    
    handleBlur(e) {
      this.isFocused = false
      if (this.validateOnBlur) {
        this.validateInput()
      }
      this.$emit('blur', e)
    },
    
    handleConfirm(e) {
      this.$emit('confirm', e)
    },
    
    handleLineChange(e) {
      // 处理多行输入框行数变化
      this.$emit('linechange', e)
    },
    
    handleClear() {
      this.$emit('input', '')
      this.$emit('update:value', '')
      this.$emit('clear')
      this.clearError()
    },
    
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible
    },
    
    validateInput() {
      if (!this.rules || this.rules.length === 0) {
        return true
      }
      
      for (let rule of this.rules) {
        // 必填验证
        if (rule.required && (!this.value || String(this.value).trim() === '')) {
          this.setError(rule.message || `${this.label || '此项'}不能为空`)
          return false
        }
        
        // 最小长度验证
        if (rule.min && String(this.value).length < rule.min) {
          this.setError(rule.message || `${this.label || '输入内容'}长度不能少于${rule.min}个字符`)
          return false
        }
        
        // 最大长度验证
        if (rule.max && String(this.value).length > rule.max) {
          this.setError(rule.message || `${this.label || '输入内容'}长度不能超过${rule.max}个字符`)
          return false
        }
        
        // 正则验证
        if (rule.pattern && !rule.pattern.test(this.value)) {
          this.setError(rule.message || `${this.label || '输入内容'}格式不正确`)
          return false
        }
        
        // 自定义验证函数
        if (rule.validator && typeof rule.validator === 'function') {
          const result = rule.validator(this.value)
          if (result !== true) {
            this.setError(result || `${this.label || '输入内容'}验证失败`)
            return false
          }
        }
      }
      
      this.clearError()
      return true
    },
    
    setError(message) {
      this.errorMessage = message
      this.hasError = true
    },
    
    clearError() {
      this.errorMessage = ''
      this.hasError = false
    },
    
    // 外部调用的验证方法
    validate() {
      return this.validateInput()
    }
  }
}
</script>

<style scoped lang = "scss">
  .input-wrapper{
    margin-bottom:16px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    // 多行输入框样式
    &.input-multiline {
      .input-main {
        align-items: flex-start;
      }
      
      .input-container {
        min-height: auto;
        height: auto;
        align-items: flex-start;
        padding: 12px;
        padding-top: 0;
        overflow: visible;
      }
      
      .input-actions {
        margin-top: 0;
      }
    }

      // 尺寸样式
  &.input-small .input-container {
    height: 36px;
    .input-field {
      font-size: 13px;
    }
  }
  
  &.input-small.input-multiline .input-container {
    min-height: auto;
    height: auto;
  }
  
  &.input-medium .input-container {
    height: 44px;
    .input-field {
      font-size: 14px;
    }
  }
  
  &.input-medium.input-multiline .input-container {
    min-height: auto;
    height: auto;
  }
  
  &.input-large .input-container {
    height: 52px;
    .input-field {
      font-size: 16px;
    }
  }
  
  &.input-large.input-multiline .input-container {
    min-height: auto;
    height: auto;
  }

  // 边框风格
  &.border-line .input-main {
    border: none;
    border-bottom: 1px solid #E5E5E5;
    border-radius: 0;
    background: transparent;
  }
  
  &.border-line.input-focused .input-main {
    border-bottom-color: $uni-color-primary;
  }
  
  &.border-line .input-container {
    border: none;
    background: transparent;
  }
  
  &.border-card .input-container {
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    background: #FAFAFA;
  }
  
  &.border-card.input-focused .input-container {
    border-color: $uni-color-primary;
  }

  // 状态样式
  &.input-disabled {
    .input-container {
      border-color: #D8D8D8;
    }
    
    .input-field {
      color: #999999;
    }
    
    .input-label .label-text {
      color: #999999;
    }
    
    .input-label .label-required {
      color: #CCCCCC;
    }
  }
  
  &.input-readonly {
    .input-field {
      color: #666666;
    }
    
    .input-label .label-text {
      color: #666666;
    }
  }
  
  &.input-error .input-container {
    border-color: $uni-color-error;
  }
  }

  .input-main {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .input-label {
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

  .input-container {
    display: flex;
    align-items: center;
    padding: 0 12px;
    position: relative;
    flex: 1;
    width: 0; /* 强制flex子元素收缩 */
    min-width: 0; /* 允许收缩到0 */
  }

.input-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #333333;
  
  &::placeholder {
    color: #C7C7C7;
  }
}

.textarea-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #333333;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: visible;
  margin-top: 1.2px;
  
  &::placeholder {
    color: #C7C7C7;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
}

.readonly-text {
  flex: 1;
  background: transparent;
  line-height: inherit;
  font-size: inherit;
  color: #C7C7C7; // 默认显示占位符颜色
  
  &.has-value {
    color: #666666; // 有值时显示内容颜色
  }
}

.input-actions {
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
    color: #C7C7C7;
    transition: color 0.2s ease;
    font-weight: 300;
    line-height: 1;
  }
  
  .eye-icon {
    font-size: 14px;
    color: #C7C7C7;
    transition: color 0.2s ease;
    line-height: 1;
  }
  
  &:active .clear-icon,
  &:active .eye-icon {
    color: #999999;
  }
}

.arrow-btn {
  transition: transform 0.3s ease;
  
  .arrow-icon {
    width: 16px;
    height: 16px;
    color: #C7C7C7;
  }
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  min-height: 20px;
}

.word-count {
  margin-left: auto;
  
  .count-text {
    font-size: 12px;
    color: #999999;
  }
}

.error-message {
  flex: 1;
  
  .error-text {
    font-size: 12px;
    color: $uni-color-error;
  }
}


</style>