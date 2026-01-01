<script>
export default {
  onLoad() {},
  methods: {},
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TagComponent from '@/components/Tags.vue'
import StatusTags from '../../components/StatusTags.vue'
import { api } from '@/utils/index'

// 队伍列表数据
const teamList = ref([])
// 加载状态
const loading = ref(false)
// 总数
const total = ref(0)

/**
 * 跳转到队伍详情页
 */
function getDetail(id){
  uni.navigateTo({
    url:`/pages/teaming/detail?team_id=${id}`
  })
}

/**
 * 获取我的队伍列表
 */
async function fetchMyTeams() {
  try {
    // 检查是否登录
    const token = uni.getStorageSync('token')
    if (!token) {
      console.log('未登录')
      teamList.value = []
      total.value = 0
      return
    }

    loading.value = true
    
    const res = await api.getMyTeams()
    
    if (res.code === 0) {
      const list = res.data.list || []
      
      // 将后端数据映射为前端需要的格式
      teamList.value = list.map(team => ({
        id: team.team_id,
        title: team.team_name,
        description: team.content || '',
        status: getStatusText(team.status),
        name: team.creator_nickname || '未知用户',
        avatar: team.creator_avatar || '/static/icon/头像1.svg',
        image: team.pictures || '/static/img/微信图片_20251110104833_364_2.png',
        tags: team.tags || [],
        members: `${team.current_members}/${team.max_members}`
      }))
      
      total.value = res.data.total || 0
      
      console.log('获取我的队伍成功，共', total.value, '个队伍')
    } else {
      throw new Error(res.message || '获取队伍列表失败')
    }
  } catch (err) {
    console.error('获取我的队伍失败:', err)
    uni.showToast({
      title: err.message || '加载失败',
      icon: 'none'
    })
    // 失败时使用空数组
    teamList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/**
 * 将状态码转换为文本
 */
function getStatusText(status) {
  const statusMap = {
    0: '已解散',
    1: '招募中',
    2: '进行中',
    3: '已完成'
  }
  return statusMap[status] || '未知状态'
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

// 页面显示时获取数据（支持从其他页面返回时刷新）
onShow(() => {
  fetchMyTeams()
})
</script>

<template>
  <!-- <link rel="stylesheet" href="static/iconfont/iconfont.css"> -->
  <view class="pageHolder">
    <view class="content">

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="teamList.length === 0" class="empty-container">
        <view class="empty-icon">📭</view>
        <text class="empty-text">还没有加入任何队伍</text>
        <text class="empty-hint">快去广场看看吧~</text>
      </view>

      <!-- 队伍列表 -->
      <view v-else class="list-container">
        <view class="list-item" v-for="item in teamList" :key="item.id">
          <view class="item-body">
            <!-- <view class="item-img">       文字       </view> -->
                <view class="item-content" @click="getDetail(item.id)">
                  <view class="author-info">
                    <img class="author-avator" :src="item.avatar" mode="aspectFill"></img>
                    <view class="author-name">{{ item.name }}</view>
                  </view>
                  <view class="item-title">{{ item.title }}</view>
                  <view class="item-description">{{ truncateText(item.description) }}</view>
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
            <text>3/5人</text>
            <StatusTags type="green" text="开发中" />
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
  overflow: hidden;
  height: 100vh;
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

  // 加载状态样式
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400rpx;
    gap: 20rpx;
    
    .loading-spinner {
      width: 60rpx;
      height: 60rpx;
      border: 6rpx solid #e5e5e5;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      font-size: 28rpx;
      color: #999;
    }
  }

  // 空状态样式
  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400rpx;
    gap: 20rpx;
    
    .empty-icon {
      font-size: 120rpx;
    }
    
    .empty-text {
      font-size: 32rpx;
      color: #666;
      font-weight: 500;
    }
    
    .empty-hint {
      font-size: 26rpx;
      color: #999;
    }
  }
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

// 旋转动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
