<template>
    <view v-if="visible" class="overlay" @tap="handleClose"></view>

    <view v-if="visible" class="menu-wrapper">
        <view class="Tab-menu">
            <view class="menu-header">
                <i class="iconfont icon-cha" @tap="handleClose"></i>
            </view>

            <view class="menu-content">
                <view class="menu-row">
                    <view class="menu-item">
                        <i class="iconfont icon-fuzhilianjie"></i>
                        <view class="item-text">复制链接</view>
                    </view>
                    <view class="menu-item">
                        <i class="iconfont icon-weixin"></i>
                        <view class="item-text">微信</view>
                    </view>
                    
                </view>
                <view class="menu-row">
                    <view class="menu-item">
                        <i class="iconfont icon-bianji"></i>
                        <view class="item-text">编辑</view>
                    </view>
                    <view class="menu-item">
                        <i class="iconfont icon-shanchu"></i>
                        <view class="item-text">删除</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
    const props = defineProps({
        visible:{
            type:Boolean,
            default:true
        }
    })
    const emit = defineEmits(['close'])
    const handleClose=()=>{
        emit('close')
    }
</script> 

<style lang="scss" scoped>
.overlay{
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    animation: fadeIn 0.3s ease-in-out;
}
.menu-wrapper
{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
        .Tab-menu{
        position: fixed;
        bottom:0;
        left: 0;
        right: 0;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-radius:16rpx;
        gap:10rpx;
        .menu-header{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 10rpx;
        }
        .menu-content{
            display: flex;
            flex-direction: column;
            gap: 40rpx;  
            padding: 20rpx 20rpx;  
            .menu-row{
                display: flex;
                justify-content: space-around;
                align-items: flex-start;
                padding:10rpx;
                .menu-item{
                    display: flex;
                    flex:1;
                    flex-direction: column;
                    align-items: center;
                    gap: 8rpx;
                }
            }
        }
    }
}

</style>