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
    description: '这是项目一的描述,看看字多了会怎么样这是项目一的描述,看看字多了会怎么样',
    status: '进行中',
  },
  
  {
    id: 1,
    title: '项目一',
    description: '字少',
    status: '进行中',
  },
  {
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },
  {
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },
  {
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },
  {
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },
  {
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },{
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },{
    id: 1,
    title: '项目一',
    description: '这是项目一的描述',
    status: '进行中',
  },
  
]
</script>

<template>
  <view class="pageHolder">
    <view class="content">
          <h1 class="title">我的队伍</h1>
      <view class="list-container">
        <view class="list-item" v-for="item in mockData" :key="item.id">
          <view class="item-body">
            <!-- <view class="item-img">       文字       </view> -->
                <view class="item-content">
                  <view class="author-info">
                    <img class="author-avator" src="/static/img/我.png" mode="aspectFill"></img>
                    <view class="author-name">作者名称</view>
                  </view>
                  <view class="item-title">{{ item.title }}</view>
                  <view class="item-description">{{ item.description.slice(0, 25) }}</view>
                  <view class="item-status">{{ item.status }}</view>
                  </view>

                <view class="item-right">
                  <img class="item-img" src="/static/img/wechat_2025-11-05_103123_039.png" mode="aspectFill"></img>
                </view>
            </view>

          <view class="item-tags"><TagComponent tagText="空洞骑士丝之歌空洞骑士" /><TagComponent tagText="空洞骑士丝之歌空洞骑士" /><TagComponent tagText="空洞骑士丝之歌空洞骑士" /></view>
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
  
  
}

.title{
  font-size: 45rpx;
  color:var(--title-color);
  font-weight: bold;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  width: 100vw;
}

.content{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex:1;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 90vh;
  width:100vw;
  border-radius: 20rpx;
  border: 1rpx solid #e5e5e5;
  box-shadow: 0 4rpx 12rpx 0 rgba(0,0,0,.08);
  margin-top: 20rpx;
  .list-container{
    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
    min-height:25vh;
    justify-content: center;
    align-self: start;
    gap:20rpx;
    padding-top: 20rpx;
    
    .list-item{
      display: flex;
      flex-direction: column;
      background: #ffffff8d;
      width:100vw;
      min-height:300rpx;
      // border-radius:15rpx;
      border: 1rpx solid #e5e5e5;
      box-shadow: 0 4rpx 12rpx 0 rgba(0,0,0,.08);
      justify-content: space-between;
      padding: 20rpx;
      .item-body{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap:40rpx;
        .item-content{
          display: flex;
          flex-direction: column;
          justify-content: center;
          .item-title{
            color:var(--title-color);
            font-size: var(--title-size);
            font-weight: bold;
          }
          .author-info{
            display: flex;
            margin-top: 10rpx;
            .author-avator{
              height:60rpx;
              width:60rpx;
            }
            .author-name{
              font-size: var(--text-size);
              color:var(--text-color);
              margin-left:20rpx;
              align-self: center;
            }
          }
        }
      }

      .item-right{
        display: flex;
        margin-right: 30rpx;
        flex-shrink: 0;
        .item-img{
          height: 180rpx;
          width: 270rpx;
          border-radius: 10rpx;
        }
      }

      .item-tags{
        margin-left: -10rpx;
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
</style>
