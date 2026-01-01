<template>
  <view class="container">
    <view class="header">
      <view class="left">
        <view class="week-selector" @click="openWeekPicker">
          <text class="week-title">第{{ currentWeek }}周</text>
          <uni-icons type="bottom" size="16" color="#333"></uni-icons>
        </view>
        <text class="semester">{{ currentSemester }}</text>
      </view>
      <view class="right-icons">
        <view class="icon-btn" @click="goToImport">
          <uni-icons type="download" size="26" color="#8bc34a"></uni-icons>
          <text class="icon-text">导入</text>
        </view>
        <view class="add-btn" @click="refreshData">
          <uni-icons type="loop" size="32" color="#7B89FF"></uni-icons>
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
            @click="showCourseDetail(course)"
          >
            <view
              class="course-card-inner"
              :style="{ backgroundColor: course.color }"
            >
              <text class="course-name">{{ course.name }}</text>
              <text class="course-location">@{{ course.location }}</text>
            </view>
          </view>

          <view class="decoration-text">学习</view>
        </view>
      </view>
    </scroll-view>

    <view v-if="showPicker" class="custom-popup-mask" @click="closeWeekPicker">
      <view class="week-picker-panel" @click.stop>
        <view class="picker-header">
          <text class="picker-title">切换周次</text>
          <text class="picker-edit" @click="goToSettings">本学期共25周</text>
        </view>
        <view class="week-grid">
          <view
            v-for="week in 25"
            :key="week"
            class="week-item"
            :class="{ active: week === currentWeek }"
            @click="selectWeek(week)"
          >
            <text class="week-num">{{ week }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";

// --- 1. 配置项 ---
// ⚠️ 确保与导入时选择的学期名称一致
const currentSemester = ref("2025-2026 第1学期");
const BASE_URL = "http://localhost:8080/api/v1";

// --- 2. 状态变量 ---
const currentWeek = ref(2); // 默认当前周
const showPicker = ref(false);
const allCourses = ref([]);

// --- 3. 颜色池 (升级版：20种柔和马卡龙色) ---
const colorPool = [
  "#FFCDD2", // 浅红
  "#F8BBD0", // 浅粉
  "#E1BEE7", // 浅紫
  "#D1C4E9", // 深紫
  "#C5CAE9", // 靛蓝
  "#BBDEFB", // 蓝色
  "#B3E5FC", // 浅蓝
  "#B2EBF2", // 青色
  "#B2DFDB", // 蓝绿
  "#C8E6C9", // 绿色
  "#DCEDC8", // 浅绿
  "#F0F4C3", // 黄绿
  "#FFF9C4", // 黄色
  "#FFECB3", // 琥珀
  "#FFE0B2", // 橙色
  "#FFCCBC", // 深橙
  "#D7CCC8", // 棕色
  "#F5F5F5", // 灰色
  "#CFD8DC", // 蓝灰
  "#E6EE9C", // 柠檬
];

// --- 4. 生命周期与监听 ---
onShow(() => {
  fetchCourseData();
});

// 监听导入页面发送的刷新事件
uni.$on("refreshSchedule", () => {
  console.log("收到刷新信号，重新加载课表数据");
  fetchCourseData();
});

// --- 5. 数据获取 ---
const fetchCourseData = () => {
  const token = uni.getStorageSync("token");

  uni.request({
    url: `${BASE_URL}/course/all`,
    method: "GET",
    data: { semester: currentSemester.value },
    header: { Authorization: `Bearer ${token}` },
    success: (res) => {
      const result = res.data;
      if (
        result.code === 200 ||
        result.courses ||
        (result.data && result.data.courses)
      ) {
        const courses = result.courses || result.data.courses || [];
        console.log("从后端获取到课程:", courses.length, "条");

        // 预处理数据：分配颜色
        allCourses.value = courses.map((c) => ({
          ...c,
          // 兼容大小写字段获取课程名
          color: getCourseColor(c.CourseName || c.course_name),
        }));
      } else {
        console.error("获取数据格式不对:", result);
      }
    },
    fail: (err) => {
      console.error("请求失败", err);
      uni.showToast({ title: "课表同步失败", icon: "none" });
    },
  });
};

// --- 6. 核心逻辑：计算当前周显示的课程 ---
const courseList = computed(() => {
  return allCourses.value
    .filter((course) => {
      // 字段兼容处理 (大写/小写)
      const startWeek = course.StartWeek || course.start_week;
      const endWeek = course.EndWeek || course.end_week;
      const type = course.WeekType || course.week_type;

      // 1. 周次范围过滤
      if (!(currentWeek.value >= startWeek && currentWeek.value <= endWeek)) {
        return false;
      }

      // 2. 单双周过滤 (假设后端 0/1=全, 2=单, 3=双)
      if (!type || type === 0 || type === 1 || type === "全周") return true;

      const isOddWeek = currentWeek.value % 2 !== 0;
      if ((type === 2 || type === "单周") && !isOddWeek) return false;
      if ((type === 3 || type === "双周") && isOddWeek) return false;

      return true;
    })
    .map((course) => {
      // 字段映射
      const weekDay = course.WeekDay || course.week_day;
      const startSection = course.StartSection || course.start_section;
      const endSection = course.EndSection || course.end_section;
      const name = course.CourseName || course.course_name;
      const location =
        course.Classroom || course.classroom || course.教室 || "未知";
      const teacher = course.Teacher || course.teacher;

      return {
        name: name,
        location: location,
        // 星期转换：后端1-7(周一~周日) -> 前端0-6 (假设你第一列是周一，CSS left: day * width)
        // 如果你的界面第一列是周一(index 0)，那么:
        day: weekDay === 7 ? 6 : weekDay - 1,
        start: startSection,
        length: endSection - startSection + 1,
        color: course.color, // 使用 fetch 时预生成的颜色
        teacher: teacher,
        raw: course, // 保留原始数据
      };
    });
});

// --- 7. 颜色分配算法 (优化版) ---
const getCourseColor = (name) => {
  if (!name) return colorPool[0];

  // 使用位移哈希算法，让相似名称产生差异更大的哈希值
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % colorPool.length;
  return colorPool[index];
};

// --- 8. 样式计算 ---
const getCourseStyle = (course) => {
  const cellHeight = 130;
  const colWidth = (750 - 90) / 7;
  const gap = 10;
  const minHeight = 100;
  const calculatedHeight = Math.max(
    course.length * cellHeight - gap,
    minHeight
  );

  return {
    top: (course.start - 1) * cellHeight + "rpx",
    left: course.day * colWidth + "rpx",
    width: colWidth - gap + "rpx",
    height: calculatedHeight + "rpx",
    margin: gap / 2 + "rpx",
    position: "absolute",
    zIndex: 10,
  };
};

// --- 9. 交互函数 ---
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
const refreshData = () => {
  fetchCourseData();
};

const showCourseDetail = (course) => {
  uni.showModal({
    title: course.name,
    content: `教室: ${course.location}\n教师: ${
      course.teacher || "暂无"
    }\n节次: ${course.start}-${course.start + course.length - 1}节`,
    showCancel: false,
  });
};

// --- 10. 静态配置 ---
const weekDates = ref([
  { week: "一", date: "29", isToday: false },
  { week: "二", date: "30", isToday: false },
  { week: "三", date: "31", isToday: true },
  { week: "四", date: "1", isToday: false },
  { week: "五", date: "2", isToday: false },
  { week: "六", date: "3", isToday: false },
  { week: "日", date: "4", isToday: false },
]);

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
    9: { start: "19:00", end: "19:45" },
    10: { start: "19:55", end: "20:40" },
    11: { start: "20:50", end: "21:35" },
    12: { start: "21:45", end: "22:30" },
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  .course-name {
    font-size: 22rpx;
    font-weight: bold;
    color: #444;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .course-location {
    font-size: 16rpx;
    color: #666; /* 稍微加深一点颜色增强对比度 */
    margin-top: 4rpx;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

/* 4. 手写弹窗核心样式 */
.custom-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;

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
        .week-num {
          font-size: 32rpx;
          color: #555;
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