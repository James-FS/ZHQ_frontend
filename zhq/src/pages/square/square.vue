<script setup>
import { ref,onMounted } from 'vue'
import TagComponent from '@/components/Tags.vue'
import StatusTags from '../../components/StatusTags.vue';
let mockData = ref([])
let total = ref()
const token = uni.getStorageSync('token')
const statusMap = {
  1: { type: 'green', text: '招募中' },
  2: { type: 'orange', text: '已截止' },
  3: { type: 'blue', text: '开发中' },
  4: { type: 'purple', text: '已结项' }
}

const getStatusInfo = (status) => {
  return statusMap[status] || { type: 'green', text: '未知' }
}

/**
 * 提取纯文本并去除HTML标签
 */
function getPlainText(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * 截断文本
 */
function truncateText(text, length = 15) {
  const plainText = getPlainText(text)
  return plainText.length > length ? plainText.slice(0, length) + '...' : plainText
}

function getDetail(id){
  console.log(id);
  uni.navigateTo({
    url:`/pages/teaming/detail?team_id=${id}`
  })
}

//获取广场列表
async function getTeamList(){
  try{
    const res = await uni.request({
      url:`http://localhost:8080/api/v1/teams`,
      method:'GET'
    })

    const result=res.data;
    if(result.code==0)
    {
      mockData.value=result.data.list;
      total.value=result.data.total;
      console.table(res.data.data.list)
    }
    else{
      uni.showToast({
      title: result.message||'获取失败',
      icon: 'none'});
    }
  } catch(err){
    console.log(err);
    uni.showToast({
    title:'网络错误',
    icon: 'none'});
  }
}


onMounted(()=>{
  getTeamList();

})
</script>

<template>
  <!-- <link rel="stylesheet" href="static/iconfont/iconfont.css"> -->
  <view class="pageHolder">
    <view class="content">

      <view class="filter-bar">
        <view class="search-part">
          <i class="iconfont icon-sousuo"></i>
          <view class="search-input">
            <CommonInput
              type="text"
              borderStyle="card"
              size="small"
            ></CommonInput>
          </view>
          <i class="iconfont icon-shaixuan"></i>
        </view>

      </view>

      <view class="list-container">
        <view class="list-item" v-for="item in mockData" :key="item.team_id">
          <view class="item-body">
            <!-- <view class="item-img">       文字       </view> -->
                <view class="item-content" @click="getDetail(item.team_id)">
                  <view class="author-info">
                    <img class="author-avator" :src="item.creator_avatar" mode="aspectFill"></img>
                    <view class="author-name">{{ item.creator_nickname }}</view>
                  </view>
                  <view class="item-title">{{ item.team_name }}</view>
                  <view class="item-description">{{ truncateText(item.content) }}</view>
                  </view>

                <view class="item-right">
                  <img class="item-img" src="/static/img/微信图片_20251110104833_364_2.png" mode="aspectFill"></img>
                </view>
            </view>

          <view class="item-tags">
            <TagComponent
              v-for="(tag, idx) in item.tags"
              :key="idx"
              :tagText="tag"
            />
          </view>
          
          <view class="item-status">
            <i class="iconfont icon-zudui"></i>
            <text>{{item.current_members}}/{{item.max_members}}人</text>
            <StatusTags 
              :type="getStatusInfo(item.status).type" 
              :text="getStatusInfo(item.status).text" 
            />
          </view>
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
  width: 100%;
  box-sizing: border-box;
}

.content{
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex:1;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 90vh;
  width:100%;
  overflow: hidden;
  border-radius: 20rpx;
  border: 1rpx solid #e5e5e5;
  box-shadow: 0 4rpx 12rpx 0 rgba(0,0,0,.08);
  margin-top: 20rpx;
  .filter-bar{
    display: flex;
    width: 100%;
    margin-top:20rpx;
    justify-content: center;
    align-items: center;
    gap:15rpx;
    .search-part{
      display: flex;
      align-items: center;
      width: 90%;
      gap:12rpx;

      margin-left: auto;
      margin-right: auto;
      .iconfont.icon-sousuo{
        flex-shrink: 0;
        font-size: 42rpx;
      }
      .search-input{
        flex: 1;                  // 剩余空间全给输入框
        height: 64rpx;            // 与图标视觉居中对齐
      }
    }
    .iconfont.icon-shaixuan{
      font-size: 42rpx;
    }
  }

  .list-container{
    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
    min-height:25vh;
    justify-content: center;
    align-self: start;
    gap:20rpx;
    padding-top: 20rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    
    .list-item{
      display: flex;
      flex-direction: column;
      background: #ffffff8d;
      width:100%;
      min-height:300rpx;
      box-sizing: border-box;
      // border-radius:15rpx;
      border: 1rpx solid #e5e5e5;
      box-shadow: 0 4rpx 12rpx 0 rgba(0,0,0,.08);
      justify-content: space-between;
      padding: 0rpx;
      overflow: hidden;
      .item-body{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap:20rpx;
        padding:20rpx;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        .item-content{
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          min-width: 0;
          overflow: hidden;
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
        margin-right: 20rpx;
        flex-shrink: 0;
        .item-img{
          height: 180rpx;
          width: 270rpx;
          border-radius: 10rpx;
        }
      }

      .item-tags{
        margin-left: -10rpx;
        margin-right: 10rpx;
        margin-top: 10rpx;
        padding:0 20rpx;
      }

      .item-status{
          border-top: 2rpx solid #d9d9d9;
          background-color: #fafafa;
          padding:20rpx;
          display: flex;
          justify-content: flex-start;
          margin-top: 10rpx;
          gap:10rpx;
          align-items: center;
          color: var(--text-color);
          font-size: calc(var(--text-size) - 2rpx);
          font-weight: var(--text-weight);
        }
      
    }
  }
}

</style>
