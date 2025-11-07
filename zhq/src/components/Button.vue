<!-- /**
 * 通用按钮组件
 * text: 按钮文本（必需）
 * type: 按钮类型 - primary（默认）, secondary, danger, warning, success
 * size: 按钮大小 - medium（默认）, small, large
 * disabled: 是否禁用 - false（默认）
 * loading: 是否加载中 - false（默认）
 * loadingText: 加载中显示文本 - '加载中...'（默认）
 * round: 是否圆形按钮 - false（默认）
 * fullWidth: 是否全宽 - false（默认）
 * plain: 是否镂空样式 - false（默认）
 * debounce: 是否启用防抖 - true（默认）
 * debounceDelay: 防抖延迟时间（毫秒） - 500（默认）
 */ -->
<template>
  <button
    class="common-btn"
    :class="[
      `btn-${type}`,
      `btn-${size}`,
      {
        'btn-loading': loading,
        'btn-disabled': disabled,
        'btn-full-width': fullWidth,
        'btn-round': round,
        'btn-plain': plain,
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载中显示 -->
    <view v-if="loading" class="btn-loading-text">{{ loadingText }}</view>
    
    <!-- 正常显示 -->
    <view v-else>{{ text }}</view>
  </button>
</template>

<script>
import { buttonDebounce } from '../utils/debounce.js';

export default {
  name: 'CommonButton',
  props: {
    // 按钮文本
    text: {
      type: String,
      required: true,
    },
    // 按钮类型：primary（主要）、secondary（次要）、danger（危险）、warning（警告）、success（成功）
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success'].includes(value),
    },
    // 按钮大小：small（小）、medium（中）、large（大）
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value),
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: false,
    },
    // 加载中显示的文本
    loadingText: {
      type: String,
      default: '加载中...',
    },
    // 是否为圆形按钮
    round: {
      type: Boolean,
      default: false,
    },
    // 是否全宽
    fullWidth: {
      type: Boolean,
      default: false,
    },
    // 是否为镂空样式
    plain: {
      type: Boolean,
      default: false,
    },
    // 是否启用防抖（默认启用）
    debounce: {
      type: Boolean,
      default: true,
    },
    // 防抖延迟时间（毫秒）
    debounceDelay: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      // 防抖处理后的点击函数
      debouncedClick: null,
    };
  },
  created() {
    // 创建防抖点击函数
    this.debouncedClick = buttonDebounce(this.emitClick, this.debounceDelay);
  },
  methods: {
    handleClick() {
      if (!this.disabled && !this.loading) {
        if (this.debounce) {
          // 使用防抖点击
          this.debouncedClick();
        } else {
          // 直接触发点击
          this.emitClick();
        }
      }
    },
    emitClick() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped lang="scss">
.common-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
  /* 按钮宽度全屏 */
  &.btn-full-width {
    width: 100%;
  }

  /* 按钮大小变体 */
  &.btn-small {
    padding: 14rpx 24rpx;
    font-size: 24rpx;
    min-height: 48rpx;
  }

  &.btn-medium {
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    min-height: 68rpx;
  }

  &.btn-large {
    padding: 25rpx 45rpx;
    font-size: 30rpx;
    min-height: 80rpx;
  }

  /* 按钮类型变体 */
  &.btn-primary {
    background-color: #2196f3;
    color: #ffffff;
    
    &:active {
      background-color: #1976d2;
    }

    &.btn-disabled {
      background-color: #90caf9;
      color: rgba(255, 255, 255, 0.6);
    }

    /* 镂空样式 */
    &.btn-plain {
      background-color: transparent;
      color: #2196f3;
      border: 2rpx solid #2196f3;

      &:active {
        background-color: #e3f2fd;
        color: #1976d2;
        border-color: #1976d2;
      }

      &.btn-disabled {
        background-color: transparent;
        color: #90caf9;
        border-color: #90caf9;
      }
    }
  }

  &.btn-secondary {
    background-color: #757575;
    color: #ffffff;
    
    &:active {
      background-color: #616161;
    }

    &.btn-disabled {
      background-color: #bdbdbd;
      color: rgba(255, 255, 255, 0.6);
    }

    /* 镂空样式 */
    &.btn-plain {
      background-color: transparent;
      color: #757575;
      border: 2rpx solid #757575;

      &:active {
        background-color: #f5f5f5;
        color: #616161;
        border-color: #616161;
      }

      &.btn-disabled {
        background-color: transparent;
        color: #bdbdbd;
        border-color: #bdbdbd;
      }
    }
  }

  &.btn-danger {
    background-color: #f44336;
    color: #ffffff;
    
    &:active {
      background-color: #d32f2f;
    }

    &.btn-disabled {
      background-color: #ef5350;
      color: rgba(255, 255, 255, 0.6);
    }

    /* 镂空样式 */
    &.btn-plain {
      background-color: transparent;
      color: #f44336;
      border: 2rpx solid #f44336;

      &:active {
        background-color: #ffebee;
        color: #d32f2f;
        border-color: #d32f2f;
      }

      &.btn-disabled {
        background-color: transparent;
        color: #ef5350;
        border-color: #ef5350;
      }
    }
  }

  &.btn-warning {
    background-color: #ff9800;
    color: #ffffff;
    
    &:active {
      background-color: #e65100;
    }

    &.btn-disabled {
      background-color: #ffb74d;
      color: rgba(255, 255, 255, 0.6);
    }

    /* 镂空样式 */
    &.btn-plain {
      background-color: transparent;
      color: #ff9800;
      border: 2rpx solid #ff9800;

      &:active {
        background-color: #fff3e0;
        color: #e65100;
        border-color: #e65100;
      }

      &.btn-disabled {
        background-color: transparent;
        color: #ffb74d;
        border-color: #ffb74d;
      }
    }
  }

  &.btn-success {
    background-color: #4caf50;
    color: #ffffff;
    
    &:active {
      background-color: #388e3c;
    }

    &.btn-disabled {
      background-color: #81c784;
      color: rgba(255, 255, 255, 0.6);
    }

    /* 镂空样式 */
    &.btn-plain {
      background-color: transparent;
      color: #4caf50;
      border: 2rpx solid #4caf50;

      &:active {
        background-color: #e8f5e8;
        color: #388e3c;
        border-color: #388e3c;
      }

      &.btn-disabled {
        background-color: transparent;
        color: #81c784;
        border-color: #81c784;
      }
    }
  }

  /* 加载状态 */
  &.btn-loading {
    opacity: 0.8;
    cursor: not-allowed;
    pointer-events: none; 
  }

  .btn-loading-text {
    opacity: 0.8;
  }

  /* 禁用状态 */
  &.btn-disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* 圆形按钮 */
  &.btn-round {
    border-radius: 50%;
    padding: 20rpx;
    width: 80rpx;
    height: 80rpx;
    display: flex;

    &.btn-small {
      width: 60rpx;
      height: 60rpx;
      padding: 12rpx;
    }

    &.btn-large {
      width: 100rpx;
      height: 100rpx;
      padding: 28rpx;
    }

    /* 圆形按钮的镂空样式调整 */
    &.btn-plain {
      border-width: 2rpx;
      border-style: solid;
      
      /* 确保圆形按钮的尺寸不因边框而改变 */
      box-sizing: border-box;
    }
  }
}
</style>
