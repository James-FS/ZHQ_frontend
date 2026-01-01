<template>
    <view class="invite-card" :class="`invite-${type}`">
        <view class="invite-header">
            <text class="invite-title">{{ title }}</text>
        </view>
        
        <view class="invite-content">
            <text class="invite-text">
            {{ text }}
            </text>
        </view>
        
        <view class="invite-button" @click="handleApplication">
            <button class="btn-handle">{{ buttonText }}</button>
        </view>
    </view>
</template>


<script setup>
import { computed } from 'vue';
    const props =defineProps({
        title: {
            type: String,
            default: 'CST2023企业邀请您加入'
        },
        text: {
            type: String,
            default: '该队伍管理员邀请你加入。如不是你要加入的队伍，请拒绝该队伍管理员邀请你加入。如不是你要加入的队伍，请拒绝'
        },
        type: {
            type: String,
            default: 'green'
        }
    });

    const emit = defineEmits(['on-apply']);

    const buttonText = computed(() => {
        return props.type === 'primary' ? '前往处理' : '申请加入'
    })
    
    function handleApplication(){
        // 触发父组件传入的事件
        emit('on-apply');
    }
</script>

<style lang="scss" scoped>
.invite-card {
  display: flex;
  flex:1;
  flex-direction: column;
  margin: 20rpx;
  gap: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
//   border: 1rpx solid #e6e8f5;       /* 浅蓝色边框 */
  background-color: #ffffff;
  min-width: 600rpx;
  border-radius: 10px;
}
.invite-primary {
  border: 1rpx solid #e6e8f5;

  .invite-header {
    background-color: #f0f5ff;
  }

  .invite-title {
    color: #0052cc;
  }

  .btn-handle {
    border: 2rpx solid #0052cc;
    color: #0052cc;

    &:active {
      background-color: #f0f5ff;
    }
  }
}

// 绿色主题
.invite-green {

  border: 1rpx solid #d9f7be;

  .invite-header {
    background-color: #f6ffed;
  }

  .invite-title {
    color: #52c41a;
  }

  .btn-handle {
    border: 2rpx solid #52c41a;
    color: #52c41a;

    &:active {
      background-color: #f6ffed;
    }
  }
}

.invite-header {
  display: flex;
  flex:1;
  align-items: center;
  background-color: #f0f5ff;        /* 浅蓝色背景 */
  min-height: 80rpx;
  padding:15rpx;
  .invite-title {
    font-size: 32rpx;               /* 标题大小 */
    font-weight: bold;              /* 粗体 */
    // color: #0052cc;                 /* 蓝色文字 */
    line-height: 1.5;
  }
}

.invite-content {
  display: flex;
  align-items: flex-start;
  padding:15rpx;
  .invite-text {
    font-size: var(--text-size);               /* 正文大小 */
    color: var(--text-color);                 /* 灰色文字 */
    line-height: 1.6;
    letter-spacing: 0.5rpx;
    font-weight:500;
  }
}

.invite-button {
  display: flex;
  justify-content: center;
  padding: 20rpx;
  .btn-handle {
    width: 100%;
    height: 80rpx;
    background-color: transparent;  /* 透明背景 */
    // color: #0052cc;                 /* 蓝色文字 */
    // border: 2rpx solid #0052cc;     /* 蓝色边框 */
    font-size: var(--text-size);
    font-weight: 600;
    border-radius: 10px;
    transition: all 0.3s ease;
    
    &:active {
      background-color: #f0f5ff;    /* 按压效果 */
      opacity: 0.8;
    }
  }
}
</style>