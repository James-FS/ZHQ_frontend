<template>
  <view class="history-container">
    <!-- 今天早些时候 -->
    <view v-if="todayList.length > 0" class="history-section">
      <view class="section-header">今天早些时候</view>
      <view class="section-card">
        <view 
          class="post-card" 
          v-for="(item, index) in todayList" 
          :key="'today-' + index"
          @click="goToPostDetail(item.id)"
        >
          <!-- 左侧缩略图 -->
          <image 
            class="post-thumbnail" 
            :src="item.image" 
            mode="aspectFill"
            @error="imageError"
          />
          
          <!-- 右侧内容区 -->
          <view class="post-content">
            <!-- 标题和时间行 -->
            <view class="title-row">
              <text class="post-title">{{ item.title }}</text>
              <text class="time-text">{{ item.timeText }}</text>
            </view>
            
            <!-- 标签容器 -->
            <view class="tags-container">
              <Tags 
                v-for="(tag, tagIndex) in item.tags" 
                :key="tagIndex"
                :tagText="tag"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 昨天或更早 -->
    <view v-if="yesterdayList.length > 0" class="history-section">
      <view class="section-header">昨天或更早</view>
      <view class="section-card">
        <view 
          class="post-card" 
          v-for="(item, index) in yesterdayList" 
          :key="'yesterday-' + index"
          @click="goToPostDetail(item.id)"
        >
          <!-- 左侧缩略图 -->
          <image 
            class="post-thumbnail" 
            :src="item.image" 
            mode="aspectFill"
            @error="imageError"
          />
          
          <!-- 右侧内容区 -->
          <view class="post-content">
            <!-- 标题和时间行 -->
            <view class="title-row">
              <text class="post-title">{{ item.title }}</text>
              <text class="time-text">{{ item.timeText }}</text>
            </view>
            
            <!-- 标签容器 -->
            <view class="tags-container">
              <Tags 
                v-for="(tag, tagIndex) in item.tags" 
                :key="tagIndex"
                :tagText="tag"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Tags from '@/components/Tags.vue'

export default {
  components: {
    Tags
  },
  
  data() {
    return {
      // 原始历史浏览列表数据（增加到14条用例）
      historyList: [
        {
          id: 1,
          title: '要是能重来，我要选李白',
          image: '/static/img/我_active.png',
          tags: ['前端', '大学生创新创业比赛','我要选李白'],
          viewTime: new Date().getTime() - 2 * 60 * 60 * 1000 // 2小时前
        },
        {
          id: 2,
          title: '还有人类吗这个宿舍',
          image: '/static/img/我_active.png',
          tags: ['后端', 'Java开发'],
          viewTime: new Date().getTime() - 5 * 60 * 60 * 1000 // 5小时前
        },
        {
          id: 3,
          title: '胃袋快来那个啊那个',
          image: '/static/img/我_active.png',
          tags: ['美食', '探店', '校园生活'],
          viewTime: new Date().getTime() - 8 * 60 * 60 * 1000 // 8小时前
        },
        {
          id: 4,
          title: '今天图书馆的人也太多了吧',
          image: '/static/img/我_active.png',
          tags: ['学习', '期末复习'],
          viewTime: new Date().getTime() - 14 * 60 * 60 * 1000 // 14小时前（今天）
        },
        {
          id: 5,
          title: '这个算法题怎么做啊求助',
          image: '/static/img/我_active.png',
          tags: ['算法', 'LeetCode', '计算机'],
          viewTime: new Date().getTime() - 25 * 60 * 60 * 1000 // 25小时前（昨天）
        },
        {
          id: 6,
          title: '分享一个超好用的VS Code插件',
          image: '/static/img/我_active.png',
          tags: ['工具', '效率', '开发'],
          viewTime: new Date().getTime() - 30 * 60 * 60 * 1000 // 30小时前
        },
        {
          id: 7,
          title: '期末考试安排出来了',
          image: '/static/img/我_active.png',
          tags: ['考试', '通知'],
          viewTime: new Date().getTime() - 50 * 60 * 60 * 1000 // 50小时前
        },
        {
          id: 8,
          title: '学校食堂新开了一家店',
          image: '/static/img/我_active.png',
          tags: ['美食', '校园', '推荐'],
          viewTime: new Date().getTime() - 72 * 60 * 60 * 1000 // 3天前
        },
        {
          id: 9,
          title: 'React Hooks最佳实践总结',
          image: '/static/img/我_active.png',
          tags: ['React', '前端框架', '技术'],
          viewTime: new Date().getTime() - 96 * 60 * 60 * 1000 // 4天前
        },
        {
          id: 10,
          title: '寻找一起组队参加比赛的小伙伴',
          image: '/static/img/我_active.png',
          tags: ['比赛', '组队', '互联网+'],
          viewTime: new Date().getTime() - 120 * 60 * 60 * 1000 // 5天前
        },
        {
          id: 11,
          title: '校园跑步打卡第30天',
          image: '/static/img/我_active.png',
          tags: ['运动', '健身', '打卡'],
          viewTime: new Date().getTime() - 144 * 60 * 60 * 1000 // 6天前
        },
        {
          id: 12,
          title: 'Python爬虫入门教程分享',
          image: '/static/img/我_active.png',
          tags: ['Python', '爬虫', '教程'],
          viewTime: new Date().getTime() - 168 * 60 * 60 * 1000 // 7天前
        },
        {
          id: 13,
          title: '图书馆占座指南',
          image: '/static/img/我_active.png',
          tags: ['学习', '图书馆', '攻略'],
          viewTime: new Date().getTime() - 192 * 60 * 60 * 1000 // 8天前
        },
        {
          id: 14,
          title: '推荐几个优质的编程学习网站',
          image: '/static/img/我_active.png',
          tags: ['学习资源', '编程', '自学'],
          viewTime: new Date().getTime() - 216 * 60 * 60 * 1000 // 9天前
        }
      ]
    }
  },
  
  computed: {
    // 今天的浏览记录
    todayList() {
      return this.getFormattedList().filter(item => item.isToday)
    },
    // 昨天或更早的浏览记录
    yesterdayList() {
      return this.getFormattedList().filter(item => !item.isToday)
    }
  },
  
  onLoad() {
    console.log('历史页面加载')
  },
  
  methods: {
    // 格式化列表数据
    getFormattedList() {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      
      // 按浏览时间倒序排序
      const sortedList = [...this.historyList].sort((a, b) => b.viewTime - a.viewTime)
      
      return sortedList.map(item => {
        const isToday = item.viewTime >= todayStart
        const timeText = this.formatTime(item.viewTime)
        
        return {
          ...item,
          isToday,
          timeText
        }
      })
    },
    
    // 格式化时间为 "X小时前"、"X分钟前" 等
    formatTime(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) {
        return '刚刚'
      } else if (minutes < 60) {
        return `${minutes}分钟前`
      } else if (hours < 24) {
        return `${hours}小时前`
      } else if (days === 1) {
        return '昨天'
      } else {
        return `${days}天前`
      }
    },
    
    // 图片加载失败处理
    imageError(e) {
      console.error('图片加载失败：', e)
    },
    
    // 获取历史浏览列表
    getHistoryList() {
      // TODO: 调用 API
    },
    
    // 跳转到帖子详情
    goToPostDetail(postId) {
      uni.navigateTo({
        url: `/src/pages/post-detail/post-detail?id=${postId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 容器 */
.history-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 16rpx;
}

/* 历史分组 */
.history-section {
  margin-bottom: 24rpx;
}

/* 分组标题 */
.section-header {
  font-size: 28rpx;
  font-weight: 500;
  color: #666666;
  padding: 12rpx 8rpx;
  margin-bottom: 12rpx;
}

/* 分组卡片容器 */
.section-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

/* 帖子卡片 - 降低高度 */
.post-card {
  display: flex;
  padding: 12rpx 16rpx; /* 从16rpx减少到12rpx */
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #f8f8f8;
  }
}

/* 左侧缩略图 - 降低高度 */
.post-thumbnail {
  width: 100rpx;   /* 从120rpx减少到100rpx */
  height: 100rpx;  /* 从120rpx减少到100rpx */
  border-radius: 10rpx;
  flex-shrink: 0;
  margin-right: 16rpx;
  background-color: #f0f0f0;
}

/* 右侧内容区 */
.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  min-width: 0; /* 重要：确保flex子元素可以收缩 */
}

/* 标题和时间行 */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8rpx; /* 从12rpx减少到8rpx */
  gap: 12rpx;
}

/* 标题 */
.post-title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  line-height: 1.3; /* 从1.4降低到1.3 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; /* 重要：确保可以收缩 */
}

/* 时间文本 */
.time-text {
  font-size: 22rpx;
  color: #999999;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.3; /* 从1.4降低到1.3 */
}

/* 标签容器 - 修复溢出问题 */
.tags-container {
  display: flex;
  flex-wrap: wrap;              /* 允许换行 */
  gap: 8rpx;
  margin-bottom: 32rpx;
  
  /* 新增：限制最多两行 */
  max-height: 88rpx;            /* 40rpx × 2 + 8rpx（两行标签高度 + 一个垂直间距） */
}
</style>