<template>
  <view class="content">

    <view class="detail-container">
        <view class="title">
          <img class="title-img" src="/static/img/wechat_2025-11-05_103123_039.png" mode="aspectFill"></img>
          <view class="title-text">
            209连胜战士教你玩懂战士——对战士全部单卡的评价
          </view>
        </view>

        <view class="author-info">
          <img class="author-avator" src="/static/img/wechat_2025-11-05_092504_970.png" mode="aspectFill"></img>
          <view class="author-name">废物利用</view>
        </view>

        <view class="detail-context">
          <mp-html :content="html" />
          <application></application>
        </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import {Application} from '@/components/Application.vue';
const id=ref(null);
onLoad((options)=>{
  id.value=options.id;
})

const html = ref(`
  <div style="color:#333;line-height:1.8;">
    <h3 style="color:#e64340;">一、单卡总览</h3>
    <p>209连胜的核心在于<strong>节奏</strong>与<strong>资源兑换</strong>，下面给出全部单卡点评：</p>
    
    <table border="1" style="border-collapse:collapse;width:100%;text-align:center;">
      <tr style="background:#f5f5f5;">
        <th style="padding:8px;">名称</th><th style="padding:8px;">评分</th><th style="padding:8px;">说明</th>
      </tr>
      <tr><td style="padding:8px;">战斗怒吼</td><td style="padding:8px;">★★★★★</td><td style="padding:8px;">节奏发动机</td></tr>
      <tr><td style="padding:8px;">盾牌格挡</td><td style="padding:8px;">★★★☆☆</td><td style="padding:8px;">过渡即可</td></tr>
    </table>

    <h3 style="color:#e64340;">二、实战截图</h3>
    <p>下图是 209 连胜关键局：</p>
  </div>
`)

let mockData={
  title:'这是一个标题',
  context:'',
  avator:'/static/img/wechat_2025-11-05_092504_970.png',
  name:'作者名称',
}
</script>

<style lang="scss" scoped>
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
}
.detail-container{
  display: flex;
  flex-direction: column;
  flex:1;
  align-items: center;
  width: 100vw;
  margin-top:20rpx;
  .title{
    width:100vw;;
    .title-text{
      font-size: var(--title-size);
      font-weight: bold;
      color:var(--title-color);
      padding:10rpx;
    }
    .title-img{
      width: 100vw;
      object-fit: cover;
      margin-bottom: 10rpx;
    }
  }

  .author-info{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    gap:20rpx;
    padding:20rpx;
    .author-avator{
      height: 180rpx;
      width: 270rpx;
      border-radius: 10rpx;
      padding:20rpx;
    }
  }

  .detail-context{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}


</style>