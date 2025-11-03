<script>
export default {
  onLoad() {},
  methods: {},
}
</script>

<script setup>
import { ref } from 'vue'
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
      <text>文本显示</text>
      <view class="list-container">
        <view class="list-item" v-for="item in mockData" :key="item.id">
          <view class="item-title">{{ item.title }}</view>
          <view class="item-description">{{ item.description }}</view>
          <text class="item-status">{{ item.status }}</text>
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
  background-color: #ffffff;
  width:90vw;
  .list-container{
    display: inline-flex;
    flex-wrap: wrap;
    min-height:40vh;
    .list-item{
      display: flex;
      background-color: #ffffff;
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
