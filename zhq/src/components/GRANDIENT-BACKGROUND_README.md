# GradientBackground V2 渐变背景组件使用说明

`GradientBackground V2` 是一个功能强大的渐变背景组件，支持：
- ✅ **任意数量的渐变点**（不再限制为 3 个）
- ✅ **自定义渐变方向**（垂直、水平、对角线、任意角度）
- ✅ **线性渐变和径向渐变**
- ✅ **完全向后兼容 V1**
- ✅ **固定定位，自动适配视口**

---

## 📦 快速开始

### 安装组件

```vue
<template>
  <view>
    <gradient-background />
    <!-- 页面内容 -->
  </view>
</template>

<script>
import GradientBackground from '@/components/background.vue'

export default {
  components: {
    GradientBackground
  }
}
</script>
```

---

## 📖 API 文档

### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `height` | String | `'800rpx'` | 渐变区域高度（支持 rpx、px、vh、% 等） |
| `direction` | String | `'to bottom'` | 渐变方向（见下方说明） |
| `type` | String | `'linear'` | 渐变类型：`'linear'` 或 `'radial'` |
| `colors` | Array | `[...]` | 渐变色数组（见下方说明）**V2 新增** |
| `topColor` | String | `'#D3E4FE'` | 顶部颜色（V1 兼容参数） |
| `midColor` | String | `'#EFF4FA'` | 中部颜色（V1 兼容参数） |
| `bottomColor` | String | `'#F5F6FB'` | 底部颜色（V1 兼容参数） |

---

### `direction` 参数详解

#### 线性渐变方向（type="linear"）

| 值 | 效果 | 示例 |
|---|------|------|
| `'to bottom'` | 从上到下（默认） | ⬇️ |
| `'to top'` | 从下到上 | ⬆️ |
| `'to right'` | 从左到右 | ➡️ |
| `'to left'` | 从右到左 | ⬅️ |
| `'to bottom right'` | 左上到右下 | ↘️ |
| `'to bottom left'` | 右上到左下 | ↙️ |
| `'to top right'` | 左下到右上 | ↗️ |
| `'to top left'` | 右下到左上 | ↖️ |
| `'45deg'` | 45度角 | 🔄 |
| `'135deg'` | 135度角 | 🔄 |
| 任意角度 | `'90deg'`, `'180deg'` 等 | 🔄 |

#### 径向渐变方向（type="radial"）

| 值 | 效果 |
|---|------|
| `'circle at center'` | 圆形，中心点 |
| `'ellipse at center'` | 椭圆形，中心点 |
| `'circle at top left'` | 圆形，左上角 |
| `'circle at 30% 40%'` | 圆形，自定义位置 |

---

### `colors` 数组结构

每个颜色对象包含：

```javascript
{
  color: '#FF6B6B',    // 必填：颜色值（十六进制、RGB、RGBA）
  position: '0%'       // 可选：位置（0%-100%，不填则自动分布）
}
```

**示例**：
```javascript
[
  { color: '#FF6B6B', position: '0%' },
  { color: '#FFA500', position: '25%' },
  { color: '#FFD700', position: '50%' },
  { color: '#90EE90', position: '75%' },
  { color: '#4169E1', position: '100%' }
]
```

---

## 🎨 使用示例

### 示例 1：默认效果（V1 兼容模式）

```vue
<gradient-background />
```

**效果**：
- 蓝色系三色渐变
- 从上到下
- 高度 800rpx

---

### 示例 2：五色彩虹渐变（垂直）

```vue
<gradient-background 
  height="100vh"
  :colors="[
    { color: '#FF0000', position: '0%' },
    { color: '#FF7F00', position: '25%' },
    { color: '#FFFF00', position: '50%' },
    { color: '#00FF00', position: '75%' },
    { color: '#0000FF', position: '100%' }
  ]"
/>
```

**效果**：
```
🔴 红色     (0%)
🟠 橙色     (25%)
🟡 黄色     (50%)
🟢 绿色     (75%)
🔵 蓝色     (100%)
```

---

### 示例 3：水平渐变（Instagram 风格）

```vue
<gradient-background 
  height="100vh"
  direction="to right"
  :colors="[
    { color: '#833ab4', position: '0%' },
    { color: '#fd1d1d', position: '50%' },
    { color: '#fcb045', position: '100%' }
  ]"
/>
```

**效果**：紫色 ➡️ 红色 ➡️ 橙色（从左到右）

---

### 示例 4：对角线渐变（45度）

```vue
<gradient-background 
  height="100vh"
  direction="45deg"
  :colors="[
    { color: '#f093fb' },
    { color: '#f5576c' }
  ]"
/>
```

**效果**：粉色到红色，45度角方向

---

### 示例 5：径向渐变（聚光灯效果）

```vue
<gradient-background 
  type="radial"
  direction="circle at center"
  height="100vh"
  :colors="[
    { color: '#ffffff', position: '0%' },
    { color: '#e0e0e0', position: '50%' },
    { color: '#333333', position: '100%' }
  ]"
/>
```

**效果**：中心白色 ⭕ 向外扩散到深灰色

---

### 示例 6：复杂多色渐变（7 个渐变点）

```vue
<gradient-background 
  height="100vh"
  :colors="[
    { color: '#ee0979', position: '0%' },
    { color: '#ff6a00', position: '16%' },
    { color: '#ffd200', position: '33%' },
    { color: '#91ff00', position: '50%' },
    { color: '#00e4ff', position: '66%' },
    { color: '#6e00ff', position: '83%' },
    { color: '#ee0979', position: '100%' }
  ]"
/>
```

**效果**：循环彩虹渐变

---

### 示例 7：自动分布渐变点（省略 position）

```vue
<gradient-background 
  :colors="[
    { color: '#667eea' },
    { color: '#764ba2' },
    { color: '#f093fb' }
  ]"
/>
```

**效果**：三色自动均匀分布（0%, 50%, 100%）

---

### 示例 8：兼容 V1 旧代码

```vue
<!-- V1 写法仍然有效 -->
<gradient-background 
  height="1000rpx"
  topColor="#FF6B35"
  midColor="#F7931E"
  bottomColor="#FDC830"
/>
```

---

## 🔥 实战场景

### 场景 1：登录页渐变背景

```vue
<template>
  <view class="login-page">
    <!-- 渐变背景 -->
    <gradient-background 
      height="100vh"
      direction="135deg"
      :colors="[
        { color: '#667eea' },
        { color: '#764ba2' }
      ]"
    />
    
    <!-- 登录表单 -->
    <view class="login-form">
      <input placeholder="用户名" />
      <input placeholder="密码" type="password" />
      <button>登录</button>
    </view>
  </view>
</template>
```

---

### 场景 2：首页渐变 + 透明导航栏

```vue
<template>
  <view class="home-page">
    <!-- 渐变背景 -->
    <gradient-background 
      height="100vh"
      :colors="[
        { color: '#D3E4FE', position: '0%' },
        { color: '#EFF4FA', position: '30%' },
        { color: '#FFFFFF', position: '60%' }
      ]"
    />
    
    <!-- 透明导航栏 -->
    <custom-navbar title="首页" :show-back="false">
      <template #right>
        <icon type="search" />
      </template>
    </custom-navbar>
    
    <!-- 内容区域 -->
    <view class="content" :style="{ paddingTop: contentPaddingTop + 'px' }">
      <text>页面内容</text>
    </view>
  </view>
</template>

<script>
import GradientBackground from '@/components/background.vue'
import CustomNavbar from '@/components/custom-navbar.vue'
import navbarPadding from '@/mixins/navbar-padding.js'

export default {
  mixins: [navbarPadding],
  components: {
    GradientBackground,
    CustomNavbar
  }
}
</script>
```

---

### 场景 3：动态切换渐变主题

```vue
<template>
  <view>
    <gradient-background 
      height="100vh"
      :colors="currentTheme"
    />
    
    <button @click="switchTheme">切换主题</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      themeIndex: 0,
      themes: [
        // 清新蓝
        [
          { color: '#D3E4FE' },
          { color: '#EFF4FA' },
          { color: '#F5F6FB' }
        ],
        // 温暖橙
        [
          { color: '#FFA751' },
          { color: '#FFE259' },
          { color: '#FAFAFA' }
        ],
        // 梦幻紫
        [
          { color: '#A18CD1' },
          { color: '#FBC2EB' },
          { color: '#FFFFFF' }
        ]
      ]
    }
  },
  computed: {
    currentTheme() {
      return this.themes[this.themeIndex]
    }
  },
  methods: {
    switchTheme() {
      this.themeIndex = (this.themeIndex + 1) % this.themes.length
    }
  }
}
</script>
```

---

## 🎨 预设配色方案

### 清新自然系

#### 薄荷绿
```javascript
colors: [
  { color: '#A8EDEA' },
  { color: '#D4F1F4' },
  { color: '#F0F9FF' }
]
```

#### 樱花粉
```javascript
colors: [
  { color: '#FFB6C1' },
  { color: '#FFE4E1' },
  { color: '#FFF5EE' }
]
```

#### 天空蓝（默认）
```javascript
colors: [
  { color: '#D3E4FE' },
  { color: '#EFF4FA' },
  { color: '#F5F6FB' }
]
```

---

### 活力炫彩系

#### Instagram
```javascript
direction: "to right"
colors: [
  { color: '#833ab4' },
  { color: '#fd1d1d' },
  { color: '#fcb045' }
]
```

#### 火焰渐变
```javascript
direction: "to top"
colors: [
  { color: '#f12711' },
  { color: '#f5af19' }
]
```

#### 海洋深蓝
```javascript
colors: [
  { color: '#2E3192' },
  { color: '#1BFFFF' }
]
```

---

### 商务专业系

#### 深邃灰
```javascript
colors: [
  { color: '#434343' },
  { color: '#000000' }
]
```

#### 午夜蓝
```javascript
colors: [
  { color: '#0F2027' },
  { color: '#203A43' },
  { color: '#2C5364' }
]
```

---

## ⚙️ 高级用法

### 1. 动画渐变效果

```vue
<template>
  <gradient-background 
    :colors="animatedColors"
    :style="{ transition: 'background 1s ease' }"
  />
</template>

<script>
export default {
  data() {
    return {
      hue: 0
    }
  },
  computed: {
    animatedColors() {
      return [
        { color: `hsl(${this.hue}, 70%, 60%)` },
        { color: `hsl(${this.hue + 60}, 70%, 60%)` },
        { color: `hsl(${this.hue + 120}, 70%, 60%)` }
      ]
    }
  },
  mounted() {
    setInterval(() => {
      this.hue = (this.hue + 1) % 360
    }, 50)
  }
}
</script>
```

---

### 2. 响应式高度

```vue
<gradient-background 
  :height="isMobile ? '100vh' : '800px'"
  :colors="themeColors"
/>
```

---

### 3. 多层渐变叠加

```vue
<template>
  <view>
    <!-- 底层渐变 -->
    <gradient-background 
      height="100vh"
      :colors="[{ color: '#000000' }, { color: '#434343' }]"
    />
    
    <!-- 顶层半透明渐变 -->
    <gradient-background 
      height="100vh"
      type="radial"
      direction="circle at center"
      :colors="[
        { color: 'rgba(255,255,255,0.3)', position: '0%' },
        { color: 'rgba(255,255,255,0)', position: '100%' }
      ]"
      :style="{ zIndex: -1 }"
    />
  </view>
</template>
```

---

## 📱 平台兼容性

| 平台 | 线性渐变 | 径向渐变 | 角度渐变 | 多色渐变 |
|------|---------|---------|---------|---------|
| H5 | ✅ | ✅ | ✅ | ✅ |
| 微信小程序 | ✅ | ✅ | ✅ | ✅ |
| 支付宝小程序 | ✅ | ✅ | ✅ | ✅ |
| App (iOS) | ✅ | ✅ | ✅ | ✅ |
| App (Android) | ✅ | ✅ | ✅ | ✅ |

---

## ⚠️ 注意事项

1. **性能优化**
   - 渐变色数量建议不超过 10 个
   - 避免频繁动态修改（会触发重绘）

2. **颜色格式**
   - 支持：`#FF6B6B`、`rgb(255,107,107)`、`rgba(255,107,107,0.5)`
   - 不支持：颜色名称（如 `red`）

3. **高度设置**
   - 推荐使用 `100vh` 覆盖整个视口
   - 使用 `rpx` 注意不同屏幕尺寸

4. **Z-index**
   - 默认 `-1`，确保在所有内容下方
   - 多层渐变需手动调整层级

5. **兼容性**
   - V1 旧代码无需修改即可使用
   - 新项目推荐使用 `colors` 数组

---

## 🔄 从 V1 迁移

### 无需修改代码

```vue
<!-- V1 代码 -->
<gradient-background 
  topColor="#FF6B35"
  midColor="#F7931E"
  bottomColor="#FDC830"
/>

<!-- V2 中仍然有效 ✅ -->
```

### 推荐升级为 V2 语法

```vue
<!-- V2 推荐写法 -->
<gradient-background 
  :colors="[
    { color: '#FF6B35', position: '0%' },
    { color: '#F7931E', position: '50%' },
    { color: '#FDC830', position: '100%' }
  ]"
/>
```

**升级优势**：
- ✅ 支持超过 3 个颜色
- ✅ 可自定义每个颜色的位置
- ✅ 代码更清晰易维护

---

## 🐛 常见问题

### Q1: 渐变没有显示？

**检查项**：
- ✅ 是否设置了 `height`
- ✅ 页面是否有其他元素遮挡（检查 z-index）
- ✅ 颜色值是否正确

---

### Q2: 渐变方向不对？

**解决方案**：
```vue
<!-- 确保 direction 值正确 -->
<gradient-background 
  direction="to bottom"  <!-- 不是 "bottom" -->
  :colors="colors"
/>
```

---

### Q3: 在小程序中不显示径向渐变？

**原因**：部分小程序平台对 `radial-gradient` 支持有限

**解决方案**：降级为线性渐变
```javascript
// 检测平台
const isSupported = uni.getSystemInfoSync().platform !== 'devtools'
```

---
