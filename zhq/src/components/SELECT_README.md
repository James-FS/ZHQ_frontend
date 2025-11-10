# Select 组件使用指南

## 组件概述

`Select.vue` 是一个基于微信风格设计的通用选择框组件，完全继承了 `Input.vue` 的样式规范。支持单选、多选、自定义选项、清空等功能。

## 功能特性

✅ **样式统一** - 与 Input.vue 保持一致的设计风格和尺寸选项  
✅ **单选/多选** - 灵活的选择模式支持  
✅ **动画效果** - 右箭头平滑旋转 + 下拉框淡入动画  
✅ **清空功能** - 支持快速清空已选项  
✅ **自定义选项** - 允许用户在下拉框底部添加新选项  
✅ **错误提示** - 内置验证和错误提示机制  
✅ **尺寸选项** - small、medium、large 三种尺寸  
✅ **边框风格** - line（线条）和 card（卡片）两种风格

## Props 参数详解

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | String | '' | 选择框标签文本 |
| `placeholder` | String | '请选择' | 未选择时的提示文本 |
| `value` | String/Number/Array | [] | 选中值（单选为 string/number，多选为 array） |
| `options` | Array | 必需 | 选项数组，格式：`[{label: '选项1', value: 'val1'}]` |
| `multiple` | Boolean | false | 是否多选模式 |
| `disabled` | Boolean | false | 是否禁用组件 |
| `readonly` | Boolean | false | 是否只读（不可交互） |
| `clearable` | Boolean | true | 是否显示清空按钮 |
| `addable` | Boolean | false | 是否允许用户添加新选项 |
| `required` | Boolean | false | 是否必填（验证用） |
| `size` | String | 'medium' | 组件尺寸：'small' \| 'medium' \| 'large' |
| `borderStyle` | String | 'line' | 边框风格：'line' \| 'card' |
| `maxOptions` | Number | null | 多选时最多选择项数（null 为无限制） |

## 事件说明

| 事件 | 参数 | 说明 |
|------|------|------|
| `input` | value | 值改变时触发（用于 v-model） |
| `change` | value | 选项改变时触发 |
| `clear` | - | 清空时触发 |
| `focus` | - | 获得焦点时触发 |
| `option-added` | newOption | 添加新选项时触发，参数格式：`{label: '新选项', value: 'custom_..'}` |

## 方法说明

| 方法 | 说明 |
|------|------|
| `validate()` | 验证选择框（检查 required），返回 Boolean |

## 使用示例

### 基础单选

```vue
<template>
  <view class="demo">
    <CommonSelect
      label="选择城市"
      placeholder="请选择城市"
      v-model="selectedCity"
      :options="cityOptions"
      size="medium"
      borderStyle="card"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedCity: '',
      cityOptions: [
        { label: '北京', value: 'bj' },
        { label: '上海', value: 'sh' },
        { label: '广州', value: 'gz' },
        { label: '深圳', value: 'sz' }
      ]
    }
  }
}
</script>
```

### 多选模式

```vue
<template>
  <view class="demo">
    <CommonSelect
      label="选择技能"
      placeholder="可选择多项"
      v-model="selectedSkills"
      :options="skillOptions"
      :multiple="true"
      :maxOptions="3"
      size="medium"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedSkills: [],
      skillOptions: [
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'Svelte', value: 'svelte' }
      ]
    }
  }
}
</script>
```

### 支持添加新选项

```vue
<template>
  <view class="demo">
    <CommonSelect
      label="选择标签"
      placeholder="请选择或添加标签"
      v-model="selectedTags"
      :options="tags"
      :addable="true"
      :multiple="true"
      @option-added="handleAddTag"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedTags: [],
      tags: [
        { label: '紧急', value: 'urgent' },
        { label: '普通', value: 'normal' },
        { label: '低优先级', value: 'low' }
      ]
    }
  },
  methods: {
    handleAddTag(newOption) {
      // 向 tags 数组中添加新选项
      this.tags.push(newOption)
      // 自动选中新添加的选项
      this.selectedTags.push(newOption.value)
    }
  }
}
</script>
```

### 带验证的必填字段

```vue
<template>
  <view class="demo">
    <CommonSelect
      label="选择类型"
      placeholder="必选项"
      v-model="selectedType"
      :options="typeOptions"
      :required="true"
      ref="typeSelect"
    />
    <view class="btn" @click="submitForm">提交</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedType: '',
      typeOptions: [
        { label: '类型A', value: 'a' },
        { label: '类型B', value: 'b' }
      ]
    }
  },
  methods: {
    submitForm() {
      if (this.$refs.typeSelect.validate()) {
        uni.showToast({ title: '验证通过' })
      } else {
        uni.showToast({ title: '请完成所有必填项', icon: 'none' })
      }
    }
  }
}
</script>
```

### 不同尺寸和风格

```vue
<template>
  <view class="demo">
    <!-- small + line -->
    <CommonSelect
      label="小型线条"
      v-model="val1"
      :options="options"
      size="small"
      borderStyle="line"
    />
    
    <!-- medium + card -->
    <CommonSelect
      label="中型卡片"
      v-model="val2"
      :options="options"
      size="medium"
      borderStyle="card"
    />
    
    <!-- large + card -->
    <CommonSelect
      label="大型卡片"
      v-model="val3"
      :options="options"
      size="large"
      borderStyle="card"
    />
  </view>
</template>
```

## 如何在项目中使用

### 1. 导入组件

在需要使用的页面 `.vue` 文件中导入：

```vue
<script>
import CommonSelect from '@/components/Select.vue'

export default {
  components: {
    CommonSelect
  },
  // ...
}
</script>
```

### 2. 全局注册（可选）

如果要在全局使用，可在 `main.js` 中注册：

```javascript
import Vue from 'vue'
import CommonSelect from './components/Select.vue'

Vue.component('CommonSelect', CommonSelect)
```

### 3. 在模板中使用

```vue
<template>
  <view>
    <CommonSelect
      label="示例选择"
      v-model="selected"
      :options="options"
    />
  </view>
</template>
```

## 样式自定义

### 使用 CSS 变量

组件使用 `$uni-color-primary` 作为主色调（可在 `uni.scss` 中修改）：

```scss
// uni.scss
$uni-color-primary: #007AFF;  // iOS 蓝
$uni-color-error: #F5222D;    // 错误红
```

### 覆盖样式

```vue
<style scoped lang="scss">
// 自定义选择框样式
::v-deep .select-wrapper {
  .select-container {
    background-color: #f5f5f5;
    border-radius: 12px;
  }
}
</style>
```

## 常见问题

**Q: 如何动态更新选项列表？**  
A: 直接修改 `options` 数据即可，组件会自动响应。

```javascript
this.options = [
  { label: '新选项1', value: 'new1' },
  { label: '新选项2', value: 'new2' }
]
```

**Q: 多选时如何限制最多选择数？**  
A: 使用 `maxOptions` 参数。

```vue
<CommonSelect :multiple="true" :maxOptions="3" />
```

**Q: 如何清空已选项？**  
A: 设置 value 为空数组（多选）或空字符串（单选）。

```javascript
// 单选清空
this.selectedValue = ''

// 多选清空
this.selectedValues = []
```

**Q: 下拉框没有显示？**  
A: 确保父级容器不是 `overflow: hidden`，且 z-index 足够高。下拉框默认 `z-index: 1000`。

## 组件结构

```
Select.vue
├── select-main
│   ├── select-label        （标签）
│   └── select-container    （选择框主体）
│       ├── select-field    （显示值）
│       └── select-actions  （清空按钮 + 箭头）
├── select-dropdown         （下拉框面板）
│   └── options-list       （选项列表）
│       ├── option-item    （选项项）
│       └── add-option-input （添加新选项）
└── select-footer          （错误信息）
```

## 相关文件

- 组件文件：`src/components/Select.vue`
- 样式参考：`src/components/Input.vue`
- 右箭头图标：`src/static/icon/右箭头.svg`
- 全局样式：`src/uni.scss`

## 更新日志

- v1.0.0 (2025-11-10)：初始版本发布，支持单选/多选、自定义选项、完整验证机制
