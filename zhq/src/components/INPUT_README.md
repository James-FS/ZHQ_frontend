  # Input 输入框组件使用说明

## 概述

`CommonInput` 是一个功能完整的通用输入框组件，采用微信风格设计，支持多种输入类型、完整的表单验证和灵活的样式配置。组件内置了清空、密码显示切换、字数统计、错误提示等实用功能。

## 功能特性

- 🎨 **多种风格**：支持线条风格（line）和卡片风格（card）
- 📏 **多种尺寸**：小（small）、中（medium）、大（large）三种尺寸
- 🔐 **密码输入**：支持密码显示/隐藏切换（👁️图标）
- 🧹 **一键清空**：内置清空按钮（×图标），可配置显示/隐藏
- ✅ **表单验证**：完整的验证规则支持（必填、长度、正则、自定义）
- 📊 **字数统计**：实时显示输入字数和最大限制
- 🚫 **状态控制**：支持禁用、只读状态
- 📱 **响应式**：适配不同设备尺寸
- 🎯 **标签布局**：标签和输入框在同一行，微信风格布局

## 基础用法

```vue
<template>
  <common-input
    label="用户名"
    placeholder="请输入用户名"
    v-model:value="username"
    :required="true"
  />
</template>

<script>
export default {
  data() {
    return {
      username: ''
    }
  }
}
</script>
```

**注意**：组件标签名为 `common-input`（小写短横线），不需要手动导入。

## API

### Props 属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| label | String | '' | - | 输入框左侧标签文本 |
| placeholder | String | '请输入内容' | - | 输入框提示文本 |
| value | String/Number | '' | - | 输入框的值（支持v-model:value） |
| type | String | 'text' | 'text'、'password'、'number'、'tel'、'email' | 输入框类型 |
| disabled | Boolean | false | true/false | 是否禁用输入框 |
| readonly | Boolean | false | true/false | 是否设为只读状态 |
| clearable | Boolean | true | true/false | 是否显示清空按钮（×图标） |
| showPassword | Boolean | true | true/false | 密码类型时是否显示显示/隐藏切换按钮 |
| maxlength | Number | null | - | 最大输入长度限制 |
| showWordLimit | Boolean | false | true/false | 是否显示字数统计（需配合maxlength使用） |
| required | Boolean | false | true/false | 是否必填（标签前显示红色*号） |
| validateOnBlur | Boolean | true | true/false | 失去焦点时是否自动验证 |
| rules | Array | [] | - | 验证规则数组 |
| size | String | 'medium' | 'small'、'medium'、'large' | 输入框尺寸 |
| borderStyle | String | 'line' | 'line'、'card' | 边框风格（线条或卡片） |

### Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| input | 输入内容时触发 | (value: string) - 当前输入值 |
| update:value | 更新value值（用于v-model:value） | (value: string) - 当前输入值 |
| focus | 获取焦点时触发 | (event: Event) - 原生focus事件 |
| blur | 失去焦点时触发 | (event: Event) - 原生blur事件 |
| confirm | 点击键盘确认键时触发 | (event: Event) - 原生confirm事件 |
| clear | 点击清空按钮时触发 | - |

### Methods 方法

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| validate() | 手动触发输入内容验证 | - | Boolean - 验证是否通过 |

### Slots 插槽

该组件暂不支持插槽，所有功能通过Props配置。

### 验证规则 (rules)

验证规则是一个数组，支持多种验证类型，会按顺序执行验证：

```javascript
const rules = [
  // 1. 必填验证
  { 
    required: true, 
    message: '此项不能为空' 
  },
  
  // 2. 最小长度验证
  { 
    min: 6, 
    message: '最少需要6个字符' 
  },
  
  // 3. 最大长度验证  
  { 
    max: 20, 
    message: '最多20个字符' 
  },
  
  // 4. 正则表达式验证
  { 
    pattern: /^[a-zA-Z0-9_]+$/, 
    message: '只能包含字母、数字和下划线' 
  },
  
  // 5. 自定义验证函数
  { 
    validator: (value) => {
      if (value.includes('admin')) {
        return '不能包含admin关键字'
      }
      return true  // 返回true表示验证通过
    }
  }
]
```

**验证规则说明：**
- `required`：必填验证，检查值是否为空或只包含空格
- `min`：最小长度验证
- `max`：最大长度验证  
- `pattern`：正则表达式验证
- `validator`：自定义验证函数，返回`true`表示通过，返回字符串表示错误信息
- `message`：验证失败时的错误提示文本
## 使用示例

### 1. 基础表单

```vue
<template>
  <view>
    <!-- 基础文本输入 -->
    <common-input
      label="用户名"
      placeholder="请输入用户名"
      v-model:value="form.username"
      :required="true"
      :rules="usernameRules"
    />
    
    <!-- 密码输入 -->
    <common-input
      label="密码"
      type="password"
      placeholder="请输入密码"
      v-model:value="form.password"
      :required="true"
      :rules="passwordRules"
    />
    
    <!-- 手机号输入（带字数统计） -->
    <common-input
      label="手机号"
      type="tel"
      placeholder="请输入手机号"
      v-model:value="form.phone"
      :maxlength="11"
      :show-word-limit="true"
      :rules="phoneRules"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        phone: ''
      },
      
      usernameRules: [
        { required: true, message: '用户名不能为空' },
        { min: 3, max: 20, message: '用户名长度为3-20个字符' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' }
      ],
      
      passwordRules: [
        { required: true, message: '密码不能为空' },
        { min: 6, message: '密码不能少于6位' },
        { 
          validator: (value) => {
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
              return '密码必须包含大小写字母和数字'
            }
            return true
          }
        }
      ],
      
      phoneRules: [
        { required: true, message: '手机号不能为空' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
      ]
    }
  }
}
</script>
```

### 2. 不同尺寸和边框风格

```vue
<template>
  <view>
    <!-- 不同尺寸 -->
    <common-input
      label="小尺寸"
      size="small"
      placeholder="小尺寸输入框"
      v-model:value="form.small"
    />
    
    <common-input
      label="中尺寸"
      size="medium"
      placeholder="中尺寸输入框（默认）"
      v-model:value="form.medium"
    />
    
    <common-input
      label="大尺寸"
      size="large"
      placeholder="大尺寸输入框"
      v-model:value="form.large"
    />
    
    <!-- 不同边框风格 -->
    <common-input
      label="线条风格"
      border-style="line"
      placeholder="底部边框风格（默认）"
      v-model:value="form.lineStyle"
    />
    
    <common-input
      label="卡片风格"
      border-style="card"
      placeholder="圆角边框风格"
      v-model:value="form.cardStyle"
    />
  </view>
</template>
```

### 3. 特殊状态

```vue
<template>
  <view>
    <!-- 禁用状态 -->
    <common-input
      label="禁用状态"
      placeholder="禁用的输入框"
      v-model:value="form.disabled"
      :disabled="true"
    />
    
    <!-- 只读状态 -->
    <common-input
      label="只读状态"
      placeholder="只读的输入框"
      v-model:value="form.readonly"
      :readonly="true"
    />
    
    <!-- 不显示清空按钮 -->
    <common-input
      label="不可清空"
      placeholder="不显示清空按钮"
      v-model:value="form.noClear"
      :clearable="false"
    />
    
    <!-- 密码不显示切换按钮 -->
    <common-input
      label="简单密码"
      type="password"
      placeholder="不显示密码切换"
      v-model:value="form.simplePassword"
      :show-password="false"
    />
  </view>
</template>
```

### 4. 表单验证示例

```vue
<template>
  <view>
    <!-- 邮箱验证 -->
    <common-input
      ref="emailInput"
      label="邮箱"
      type="email"
      placeholder="请输入邮箱地址"
      v-model:value="email"
      :rules="emailRules"
    />
    
    <!-- 确认密码验证（动态规则） -->
    <common-input
      label="确认密码"
      type="password"
      placeholder="请再次输入密码"
      v-model:value="confirmPassword"
      :rules="confirmPasswordRules"
    />
    
    <!-- 操作按钮 -->
    <view class="form-actions">
      <button @click="validateForm">验证表单</button>
      <button @click="resetForm">重置表单</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      
      emailRules: [
        { required: true, message: '邮箱不能为空' },
        { 
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
          message: '请输入正确的邮箱地址' 
        }
      ]
    }
  },
  
  computed: {
    // 动态验证规则
    confirmPasswordRules() {
      return [
        { required: true, message: '确认密码不能为空' },
        { 
          validator: (value) => {
            if (value !== this.password) {
              return '两次输入的密码不一致'
            }
            return true
          }
        }
      ]
    }
  },
  
  methods: {
    validateForm() {
      // 手动验证指定输入框
      const emailValid = this.$refs.emailInput.validate()
      
      if (emailValid) {
        uni.showToast({
          title: '表单验证通过',
          icon: 'success'
        })
      } else {
        uni.showToast({
          title: '表单验证失败',
          icon: 'error'
        })
      }
    },
    
    resetForm() {
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
    }
  }
}
</script>
```

### 5. 监听输入事件

```vue
<template>
  <common-input
    label="实时监听"
    placeholder="输入内容会实时显示"
    v-model:value="inputValue"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    @clear="onClear"
    @confirm="onConfirm"
  />
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    }
  },
  
  methods: {
    onInput(value) {
      console.log('输入内容:', value)
    },
    
    onFocus(event) {
      console.log('获取焦点')
    },
    
    onBlur(event) {
      console.log('失去焦点')
    },
    
    onClear() {
      console.log('清空内容')
    },
    
    onConfirm(event) {
      console.log('确认输入')
    }
  }
}
</script>
```

## 样式定制

组件使用了 uni-app 的 SCSS 变量，你可以通过修改 `uni.scss` 来定制主题：

```scss
// 主要颜色
$uni-color-primary: #07C160;     // 主色调（聚焦边框色）
$uni-color-error: #FA5151;       // 错误色（验证失败）

// 文字颜色
$uni-text-color: #333333;        // 主文字颜色
$uni-text-color-grey: #999999;   // 次要文字颜色

// 边框颜色
$uni-border-color: #E5E5E5;      // 默认边框颜色
```

### 自定义样式类

组件会根据状态自动应用不同的CSS类：

```scss
.input-wrapper {
  // 尺寸类
  &.input-small { /* 小尺寸样式 */ }
  &.input-medium { /* 中尺寸样式 */ }
  &.input-large { /* 大尺寸样式 */ }
  
  // 边框风格类
  &.border-line { /* 线条风格 */ }
  &.border-card { /* 卡片风格 */ }
  
  // 状态类
  &.input-disabled { /* 禁用状态 */ }
  &.input-readonly { /* 只读状态 */ }
  &.input-error { /* 验证错误状态 */ }
  &.input-focused { /* 聚焦状态 */ }
}
```

## 注意事项

### 1. 数据绑定
- ✅ 使用 `v-model:value` 进行双向数据绑定
- ❌ 不要使用 `v-model`（不支持）

### 2. 验证相关
- 失焦时会自动触发验证（可通过 `validateOnBlur: false` 关闭）
- 手动验证使用 `this.$refs.inputRef.validate()` 方法
- 验证规则按数组顺序执行，遇到第一个失败的规则就停止
- 验证通过时会自动清除错误信息

### 3. 功能限制
- 清空按钮只在有内容且非禁用/只读状态下显示
- 密码切换按钮只在 `type="password"` 时有效
- 字数统计需要同时设置 `showWordLimit: true` 和 `maxlength`
- 必填标识（红色*）只在设置 `required: true` 时显示

### 4. 事件处理
- `@input` 事件在每次输入时触发，获取最新值
- `@update:value` 用于v-model:value，不需要手动监听
- `@clear` 事件在点击清空按钮时触发，此时value已被清空

### 5. 组件引用
- 组件已全局注册，标签名为 `common-input`
- 无需手动导入，可直接在模板中使用
- 如需调用组件方法，请使用 `ref` 获取组件实例

## 常见问题

### Q: 为什么验证不生效？
A: 检查是否设置了 `validateOnBlur: false`，或验证规则格式是否正确。

### Q: 为什么清空按钮不显示？
A: 清空按钮需要同时满足：`clearable: true`（默认）、有输入内容、非禁用状态、非只读状态。

### Q: 如何自定义验证错误样式？
A: 验证失败时组件会自动添加 `.input-error` 类，可通过此类自定义样式。

### Q: 密码输入框的显示/隐藏图标如何自定义？
A: 目前使用emoji图标（👁️），如需自定义，需要修改组件源码中的 `.eye-icon` 部分。

## 兼容性

| 平台 | 支持情况 | 说明 |
|------|----------|------|
| ✅ H5 | 完全支持 | 所有功能正常 |
| ✅ 微信小程序 | 完全支持 | 所有功能正常 |
| ✅ APP | 完全支持 | 所有功能正常 |
| ✅ 支付宝小程序 | 完全支持 | 所有功能正常 |
| ✅ 百度小程序 | 完全支持 | 所有功能正常 |
| ✅ 字节跳动小程序 | 完全支持 | 所有功能正常 |
| ✅ QQ小程序 | 完全支持 | 所有功能正常 |

**版本要求：**
- uni-app 2.x 及以上版本
- Vue 2.x 或 Vue 3.x

## 更新日志

### v1.0.0
- ✨ 初始版本发布
- 🎨 支持微信风格设计
- 📱 支持多种输入类型和验证规则
- 🔧 支持多种尺寸和边框风格
- 💡 内置清空和密码显示切换功能

---

> 如有问题或建议，欢迎提交 Issue 或 PR！