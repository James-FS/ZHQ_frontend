<template>
  <view class="container">
    <view class="header">
      <view class="left">
        <view class="week-selector" @click="openWeekPicker">
          <text class="week-title">第{{ currentWeek }}周</text>
          <uni-icons type="bottom" size="16" color="#333"></uni-icons>
        </view>
        <text class="semester">2025-2026 第1学期</text>
      </view>
      <view class="right-icons">
        <view class="icon-btn" @click="goToImport">
          <uni-icons type="download" size="26" color="#8bc34a"></uni-icons>
          <text class="icon-text">导入</text>
        </view>
        <uni-icons type="scan" size="26" color="#333"></uni-icons>
        <view class="add-btn">
          <uni-icons type="plus-filled" size="32" color="#7B89FF"></uni-icons>
        </view>
      </view>
    </view>

    <view class="date-bar">
      <view class="month-box">
        <text class="month-num">12</text>
        <text class="month-text">月</text>
      </view>
      <view class="days">
        <view
          v-for="(item, index) in weekDates"
          :key="index"
          class="day-item"
          :class="{ active: item.isToday }"
        >
          <text class="week-day">{{ item.week }}</text>
          <text class="day-num">{{ item.date }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="timetable-scroll">
      <view class="course-grid">
        <view class="time-axis">
          <view v-for="num in 12" :key="num" class="time-slot">
            <text class="slot-time start">{{ getTimeRange(num).start }}</text>
            <text class="slot-num">{{ num }}</text>
            <text class="slot-time end">{{ getTimeRange(num).end }}</text>
          </view>
        </view>

        <view class="courses-container">
          <view class="grid-background">
            <view v-for="num in 12" :key="num" class="grid-row-line"></view>
          </view>
          <view
            v-for="(course, index) in courseList"
            :key="index"
            class="course-card-wrapper"
            :style="[getCourseStyle(course)]"
          >
            <view
              class="course-card-inner"
              :style="{ backgroundColor: course.color }"
            >
              <text class="course-name">{{ course.name }}</text>
              <text class="course-location">@{{ course.location }}</text>
            </view>
          </view>
          <view class="decoration-text">谷雨</view>
        </view>
      </view>
    </scroll-view>

    <view v-if="showPicker" class="custom-popup-mask" @click="closeWeekPicker">
      <view class="week-picker-panel" @click.stop>
        <view class="picker-header">
          <text class="picker-title">查看周课表</text>
          <text class="picker-edit" @click="goToSettings">修改当前周</text>
        </view>
        <view class="week-grid">
          <view
            v-for="week in 25"
            :key="week"
            class="week-item"
            :class="{ active: week === currentWeek, is_current: week === 18 }"
            @click="selectWeek(week)"
          >
            <text class="week-num">{{ week }}</text>
            <view v-if="week === 18" class="current-badge">本周</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

// --- 状态变量 ---
const currentWeek = ref(18);
const showPicker = ref(false); // 控制手写弹窗显示

// --- 逻辑函数 ---
const openWeekPicker = () => {
  showPicker.value = true;
};

const closeWeekPicker = () => {
  showPicker.value = false;
};

const selectWeek = (week) => {
  currentWeek.value = week;
  closeWeekPicker();
  uni.showToast({ title: `第${week}周`, icon: "none" });
};

const goToImport = () => {
  uni.navigateTo({ url: "/pages/import/import" });
};

const goToSettings = () => {
  showPicker.value = false;
  uni.navigateTo({ url: "/pages/settings/week-setting" });
};

// --- 课表渲染逻辑 ---
const weekDates = ref([
  { week: "一", date: "29", isToday: false },
  { week: "二", date: "30", isToday: false },
  { week: "三", date: "31", isToday: true },
  { week: "四", date: "1", isToday: false },
  { week: "五", date: "2", isToday: false },
  { week: "六", date: "3", isToday: false },
  { week: "日", date: "4", isToday: false },
]);

const courseList = ref([
  {
    name: "算法设计与分析*",
    location: "文渊303",
    day: 0,
    start: 1,
    length: 2,
    color: "#E3F2FD",
  },
  {
    name: "形体与政策1*",
    location: "文新213",
    day: 1,
    start: 1,
    length: 2,
    color: "#F3E5F5",
  },
  {
    name: "软件质量保证",
    location: "电子楼",
    day: 3,
    start: 1,
    length: 2,
    color: "#E8F5E9",
  },
]);

const getCourseStyle = (course) => {
  const cellHeight = 130;
  const colWidth = (750 - 90) / 7;
  const gap = 10;
  return {
    top: (course.start - 1) * cellHeight + "rpx",
    left: course.day * colWidth + "rpx",
    width: colWidth - gap + "rpx",
    height: course.length * cellHeight - gap + "rpx",
    margin: gap / 2 + "rpx",
    position: "absolute",
    zIndex: 10,
  };
};

const getTimeRange = (num) => {
  const times = {
    1: { start: "08:30", end: "09:15" },
    2: { start: "09:20", end: "10:05" },
    3: { start: "10:25", end: "11:10" },
    4: { start: "11:15", end: "12:00" },
    5: { start: "13:50", end: "14:35" },
    6: { start: "14:40", end: "15:25" },
    7: { start: "15:45", end: "16:30" },
    8: { start: "16:35", end: "17:20" },
  };
  return times[num] || { start: "", end: "" };
};
</script>

<style lang="scss">
.container {
  background-color: #fcfdf7;
  min-height: 100vh;
}

/* 1. 顶部 Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60rpx 30rpx 20rpx;
  .week-selector {
    display: flex;
    align-items: center;
    .week-title {
      font-size: 42rpx;
      font-weight: bold;
    }
  }
  .right-icons {
    display: flex;
    align-items: center;
    uni-icons {
      margin-left: 20rpx;
    }
    .icon-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon-text {
        font-size: 18rpx;
        color: #8bc34a;
        font-weight: bold;
      }
    }
  }
}

/* 2. 日期条 */
.date-bar {
  display: flex;
  background-color: #dcedc8;
  padding: 15rpx 0;
  .month-box {
    width: 90rpx;
    text-align: center;
    color: #689f38;
    .month-num {
      font-size: 28rpx;
      font-weight: bold;
    }
  }
  .days {
    flex: 1;
    display: flex;
    justify-content: space-around;
    .day-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      &.active {
        background: #8bc34a;
        color: #fff;
        border-radius: 12rpx;
        padding: 0 10rpx;
      }
    }
  }
}

/* 3. 课表核心网格 */
.timetable-scroll {
  height: calc(100vh - 220rpx);
}
.course-grid {
  display: flex;
  position: relative;
}
.time-axis {
  width: 90rpx;
  .time-slot {
    height: 130rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 8rpx 0;
    box-sizing: border-box;
    .slot-num {
      font-size: 28rpx;
      color: #333;
    }
    .slot-time {
      font-size: 18rpx;
      color: #bbb;
    }
  }
}
.courses-container {
  flex: 1;
  position: relative;
  height: 1560rpx;
}
.grid-row-line {
  height: 130rpx;
  border-bottom: 1rpx dashed rgba(0, 0, 0, 0.05);
}
.course-card-wrapper {
  position: absolute;
  z-index: 5;
}
.course-card-inner {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  padding: 10rpx;
  box-sizing: border-box;
  .course-name {
    font-size: 22rpx;
    font-weight: bold;
    color: #444;
  }
  .course-location {
    font-size: 18rpx;
    color: #888;
  }
}

/* 4. 手写弹窗核心样式 - 重点 */
.custom-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明遮罩 */
  z-index: 999;
  display: flex;
  align-items: flex-end; /* 靠底部 */

  .week-picker-panel {
    width: 100%;
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
    padding: 40rpx 30rpx 60rpx;

    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40rpx;
      .picker-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }
      .picker-edit {
        font-size: 28rpx;
        color: #7b89ff;
      }
    }

    .week-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 25rpx;
      .week-item {
        height: 110rpx;
        background-color: #f8f9f5;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &.active {
          background-color: #7b89ff;
          .week-num {
            color: #fff;
          }
        }
        &.is_current {
          border: 2rpx solid #8bc34a;
        }
        .week-num {
          font-size: 32rpx;
          color: #555;
        }
        .current-badge {
          font-size: 18rpx;
          color: #fff;
          background: #8bc34a;
          padding: 2rpx 8rpx;
          border-radius: 6rpx;
          margin-top: 4rpx;
        }
      }
    }
  }
}

.decoration-text {
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
  font-size: 60rpx;
  color: rgba(104, 159, 56, 0.1);
  writing-mode: vertical-rl;
}
</style>