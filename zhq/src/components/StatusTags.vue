<!-- /**
 * 状态标签组件
 * type: 标签类型（green, orange, blue, purple）
 * text: 标签文本
 */ -->
<template>
    <view class = "status-tag":class="`status-${type}`">
        <text class="tag-text">{{ text }}</text>
        
    </view>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'green'
    },
    text: {
        type: String,
        default: '标签'
    }
})
</script>

<style lang="scss" scoped>
.status-tag {
    margin:5rpx;
    padding: 5rpx 13rpx;
    border-radius: 30rpx;
    font-size: calc(var(--text-size) - 5rpx);
    // border: 1rpx solid #797979;
    &.status-green {
        background-color: #e8f5e8;
        color: #619e64;
    }
    &.status-orange {
        background-color: #ffe8d6;
        color: var(--dark-primary-color);
    }

    &.status-blue {
        background-color: #e3f2fd;
        color: #1976d2;
    }
    &.status-purple {
        background-color: #f3e5f5;
        color: #7b1fa2;
    }

    &.status-warning {
        background-color: var(--primary-color);
    }
    &.status-error {
        background-color: var(--accent-color);
    }
}
</style>