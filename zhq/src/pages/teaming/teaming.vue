<script>
export default {
  onLoad() {},
  methods: {},
}
</script>

<script setup>
import { ref } from 'vue'
import TagComponent from '@/components/tags.vue'

let mockData = [
  {
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },
  {
    id: 2,
    title: '项目二',
    description: '这是项目二的描述',
    status: '已完成',
  },
]
</script>

<template>
  <view class="pageHolder">
    <h1>我的项目</h1>
    <view class="content">
      <view class="list-container">
        <view class="list-item" v-for="item in mockData" :key="item.id">
          <view class="list-body">
            <view class="item-title">{{ item.title }}</view>
            <view class="item-description">{{ item.description }}</view>
            <view class="item-status">{{ item.status }}</view>
            </view>
          <view class="item-tags"><TagComponent tagText="空洞骑士丝之歌空洞骑士" /></view>
        </view>
      </view>
    </view>

  </view>
</template>



<style lang="scss">
.pageHolder{
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  height: 100vh;
  
}

.content{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  background: linear-gradient(180deg, #ffffff 0%, #e9e9e9 100%);
  min-height: 90vh;
  width:95vw;
  border-radius: 20rpx;
  border: 1rpx solid #e5e5e5;
  box-shadow: 0 4rpx 12rpx 0 rgba(0,0,0,.08);
  margin-top: 20rpx;
  .list-container{
    display: flex;
    flex-wrap: wrap;
    min-height:40vh;
    justify-content: center;
    align-self: start;
    gap:20rpx;
    padding-top: 20rpx;
    .list-item{
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      width:80vw;
      border-radius:15rpx;
      justify-content: space-between;
      .list-body{
        .list-title{

        }
      }
      
    }
  }
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
