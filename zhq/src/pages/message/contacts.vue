<template>
  <view class="contacts-page">
    <!-- 顶部导航栏 -->
    <!-- <view class="header-content">
      <view class="header-back">
      </view>
      <view class="header-icons">
      </view>
    </view> -->

    <!-- 通讯录列表 -->
    <scroll-view class="contacts-scroll" scroll-y="true" :scroll-into-view="scrollIntoView">
      <view class="contacts-list">
        <view v-for="letter in availableLetters" :key="letter" :id="'letter-' + letter">
          <!-- 首字母标题 -->
          <view class="letter-header">
            <text class="letter-text">{{ letter }}</text>
          </view>

          <!-- 该组联系人列表 -->
          <view 
            v-for="(item, index) in getContactsByLetter(letter)" 
            :key="letter + '-' + index"
            class="contact-item"
            @click="openChat(item)"
          >
            <image class="contact-avatar" :src="item.avatar" mode="aspectFill"></image>
            <view class="contact-info">
              <text class="contact-name">{{ item.name }}</text>
              <text class="contact-status" v-if="item.isOnline" :class="{ online: true }">在线</text>
              <text class="contact-status" v-else>离线</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 字母索引栏 - 只显示有联系人的字母 -->
    <view class="letter-index">
      <view 
        v-for="letter in availableLetters" 
        :key="letter"
        class="index-item"
        @click="scrollToLetter(letter)"
      >
        <text class="index-text">{{ letter }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import pinyin from 'pinyin'

// 联系人列表
const contacts = ref([
  { id: 1, name: '騛速', avatar: '/static/icon/头像1.svg', isOnline: true },
  { id: 2, name: '鬼叶', avatar: '/static/icon/头像2.svg', isOnline: true },
  { id: 3, name: '胃袋', avatar: '/static/icon/头像3.svg', isOnline: false },
  { id: 4, name: '张三', avatar: '/static/icon/头像1.svg', isOnline: true },
  { id: 5, name: '李四', avatar: '/static/icon/头像2.svg', isOnline: true },
  { id: 6, name: '王五', avatar: '/static/icon/头像3.svg', isOnline: false },
  { id: 7, name: '赵六', avatar: '/static/icon/头像1.svg', isOnline: true },
  { id: 8, name: '孙七', avatar: '/static/icon/头像2.svg', isOnline: true },
  { id: 9, name: '周八', avatar: '/static/icon/头像3.svg', isOnline: false },
  { id: 10, name: '吴九', avatar: '/static/icon/头像1.svg', isOnline: true },
  { id: 11, name: '郑十',  isOnline: false },
  { id: 12, name: '冯十一', avatar: '/static/icon/头像3.svg', isOnline: true },
  { id: 13, name: '陈十二', avatar: '/static/icon/头像1.svg', isOnline: true },
  { id: 14, name: '褚十三', avatar: '/static/icon/头像2.svg', isOnline: false },
  { id: 15, name: '魏十四', avatar: '/static/icon/头像3.svg', isOnline: true },
  { id: 16, name: 'Alice', avatar: '/static/icon/头像1.svg', isOnline: true },
  { id: 17, name: 'Bob', avatar: '/static/icon/头像2.svg', isOnline: false },
  { id: 18, name: 'Charlie', avatar: '/static/icon/头像3.svg', isOnline: true },
])

// 用于scroll-into-view的ID
const scrollIntoView = ref('')

// 获取字符的首字母
const getFirstLetter = (text) => {
  if (!text) return '#'
  
  const firstChar = text.charAt(0)
  
  // 如果是英文字母或数字，直接返回大写
  if (/[a-zA-Z0-9]/.test(firstChar)) {
    return firstChar. toUpperCase()
  }
  
  // 中文字符转拼音首字母
  try {
    const pinyinResult = pinyin(firstChar, {
      heteronym: false, // 不需要多音字
      style: pinyin.STYLE_FIRST_LETTER // 只取首字母
    })
    
    if (pinyinResult && pinyinResult.length > 0) {
      const letter = pinyinResult[0][0]. toUpperCase()
      return /^[A-Z]$/.test(letter) ? letter : '#'
    }
  } catch (e) {
    console.error('拼音转换错误:', e)
  }
  
  return '#'
}

// 计算有联系人的字母列表
const availableLetters = computed(() => {
  const letterSet = new Set()
  
  contacts.value.forEach(contact => {
    const letter = getFirstLetter(contact. name)
    letterSet.add(letter)
  })
  
  // 转换为数组并排序（A-Z优先，#最后）
  return Array.from(letterSet).sort((a, b) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })
})

// 将联系人按首字母分类
const getContactsByLetter = (letter) => {
  return contacts.value.filter(contact => {
    const firstLetter = getFirstLetter(contact.name)
    return firstLetter === letter
  }).  sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
}

// 滚动到指定首字母
const scrollToLetter = (letter) => {
  scrollIntoView.value = 'letter-' + letter
  console.log('滚动到:', letter)
}

// 打开聊天
const openChat = (item) => {
  console.log('打开聊天:', item.  name)
  uni.navigateTo({
    url: `/pages/chat/chat?userId=${item.id}&username=${encodeURIComponent(item.name)}`
  })
}

// 添加联系人
const handleAdd = () => {
  uni.showToast({
    title: '添加联系人功能开发中',
    icon: 'none'
  })
}

// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 页面加载时初始化
onMounted(() => {

})
</script>

<style scoped lang="scss">
// 变量定义
$primary-bg: #f7f7f7;
$white-bg: #ffffff;
$border-color: #e5e5e5;
$text-black: #000000;
$text-gray: #888888;
$text-light-gray: #999999;
$online-color: #4CAF50;

$header-height: 88rpx;
$avatar-size: 88rpx;

// 混入
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contacts-page {
  height: 100vh;
  background-color: $primary-bg;
  display: flex;
  flex-direction: column;
  position: relative;

  // 顶部导航栏
  .header-content {
    background-color: $white-bg;
    padding: 0 32rpx;
    border-bottom: 1rpx solid $border-color;
    height: $header-height;
    @include flex-between;

    .header-back {
      @include flex-center;
      gap: 16rpx;
      flex: 1;

      .icon-back {
        width: 48rpx;
        height: 48rpx;
      }

      .header-title {
        font-size: 34rpx;
        font-weight: 500;
        color: $text-black;
      }
    }

    .header-icons {
      @include flex-center;
      gap: 32rpx;

      .icon {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }

  // 通讯录滚动区域
  .contacts-scroll {
    flex: 1;
    background-color: $white-bg;
    overflow-y: auto;
  }

  // 通讯录列表
  .contacts-list {
    background-color: $white-bg;

    // 首字母标题
    .letter-header {
      background-color: $primary-bg;
      padding: 12rpx 32rpx;
      border-bottom: 1rpx solid $border-color;
      position: sticky;
      top: 0;
      z-index: 10;

      .letter-text {
        font-size: 26rpx;
        font-weight: 600;
        color: $text-gray;
      }
    }

    // 联系人项
    .contact-item {
      display: flex;
      align-items: center;
      padding: 20rpx 32rpx;
      border-bottom: 1rpx solid $border-color;
      background-color: $white-bg;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }

      &:active {
        background-color: #ebebeb;
      }

      .contact-avatar {
        width: $avatar-size;
        height: $avatar-size;
        border-radius: 8rpx;
        margin-right: 24rpx;
      }

      .contact-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .contact-name {
          font-size: 32rpx;
          font-weight: 400;
          color: $text-black;
          margin-bottom: 6rpx;
        }

        .contact-status {
          font-size: 24rpx;
          color: $text-light-gray;

          &.online {
            color: $online-color;
          }
        }
      }
    }
  }

  // 字母索引栏 - 只显示有联系人的字母
  .letter-index {
    z-index: 1000;
    position: absolute;
    right: 12rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rpx 4rpx;
    border-radius: 8rpx;
    gap: 10rpx;
    max-height: 80vh;
    overflow-y: auto;

    .index-item {
      width: 30rpx;
      height: 30rpx;
      @include flex-center;
      border-radius: 4rpx;
      transition: all 0.2s;

      .index-text {
        font-size: 18px;
        color: $text-gray;
        font-weight: 500;
      }

      &:active {
        background-color: $primary-bg;
        transform: scale(1.1);
      }
    }
  }
}
</style>