# 防抖函数工具类使用说明

## 概述

本工具类提供了多种防抖和节流功能，用于优化用户交互体验，防止频繁触发事件导致的性能问题。

## 功能列表

- **基础防抖函数** (`debounce`) - 支持立即执行和延迟执行两种模式
- **节流函数** (`throttle`) - 规定时间内只执行一次
- **按钮防抖函数** (`buttonDebounce`) - 专为按钮点击优化，支持异步操作
- **防抖管理器** (`DebounceManager`) - 管理多个防抖实例

---

## 1. 基础防抖函数 (debounce)

### 功能说明
在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

### 语法
```javascript
debounce(func, delay, immediate)
```

### 参数
- `func` (Function): 要执行的函数
- `delay` (number): 延迟时间（毫秒），默认300ms
- `immediate` (boolean): 是否立即执行一次，默认false

### 使用示例

#### 延迟执行模式（默认）
```javascript
import { debounce } from '@/utils/debounce.js'

// 搜索输入防抖
const searchInput = debounce((keyword) => {
  console.log('搜索:', keyword)
  // 执行搜索API调用
}, 500)

// 在输入框中使用
onInput(e) {
  searchInput(e.detail.value)
}
```

#### 立即执行模式
```javascript
import { debounce } from '@/utils/debounce.js'

// 点击事件防抖 - 立即执行第一次，后续点击需等待
const handleClick = debounce(() => {
  console.log('按钮被点击')
}, 1000, true) // 立即执行模式

// 在页面中使用
<button @click="handleClick">点击我</button>
```

---

## 2. 节流函数 (throttle)

### 功能说明
规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

### 语法
```javascript
throttle(func, delay)
```

### 参数
- `func` (Function): 要执行的函数
- `delay` (number): 延迟时间（毫秒），默认300ms

### 使用示例

#### 滚动事件节流
```javascript
import { throttle } from '@/utils/debounce.js'

// 滚动事件处理
const handleScroll = throttle(() => {
  console.log('页面滚动中...')
  // 处理滚动逻辑
}, 200)

// 在页面中使用
onPageScroll(e) {
  handleScroll()
}
```

#### 窗口大小改变事件节流
```javascript
import { throttle } from '@/utils/debounce.js'

const handleResize = throttle(() => {
  console.log('窗口大小改变')
  // 重新计算布局
}, 300)

// 监听窗口大小变化
uni.onWindowResize(handleResize)
```

---

## 3. 按钮防抖函数 (buttonDebounce)

### 功能说明
专门为按钮点击优化的防抖函数，支持异步操作。等待接口调用完成后再开始延迟计时，防止用户重复点击。

### 语法
```javascript
buttonDebounce(func, delay)
```

### 参数
- `func` (Function): 点击回调函数
- `delay` (number): 防抖延迟时间，默认500ms

### 使用示例

#### 普通按钮点击防抖
```javascript
import { buttonDebounce } from '@/utils/debounce.js'

// 普通函数防抖
const handleSubmit = buttonDebounce(() => {
  console.log('表单提交')
  uni.showToast({ title: '提交成功' })
}, 800)

// 在页面中使用
<button @click="handleSubmit">提交表单</button>
```

#### 异步操作防抖
```javascript
import { buttonDebounce } from '@/utils/debounce.js'

// 异步API调用防抖
const handleAsyncSubmit = buttonDebounce(async () => {
  try {
    uni.showLoading({ title: '提交中...' })
    
    // 模拟API调用
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 2000)
    })
    
    console.log('API调用结果:', result)
    uni.showToast({ title: '提交成功' })
  } catch (error) {
    console.error('提交失败:', error)
    uni.showToast({ title: '提交失败', icon: 'error' })
  } finally {
    uni.hideLoading()
  }
}, 1000)

// 在页面中使用
<button @click="handleAsyncSubmit">异步提交</button>
```

---

## 4. 防抖管理器 (DebounceManager)

### 功能说明
可以为不同的函数创建独立的防抖实例，方便管理多个防抖操作。

### 使用示例

#### 创建防抖管理器实例
```javascript
import { DebounceManager, defaultDebounceManager } from '@/utils/debounce.js'

// 使用默认实例
const debounceManager = defaultDebounceManager

// 或创建新实例
const myDebounceManager = new DebounceManager()
```

#### 执行防抖函数
```javascript
import { defaultDebounceManager } from '@/utils/debounce.js'

export default {
  methods: {
    // 搜索防抖
    onSearchInput(e) {
      defaultDebounceManager.execute(
        'search', // 唯一标识
        this.performSearch, // 要执行的函数
        500, // 延迟时间
        e.detail.value // 函数参数
      )
    },
    
    // 保存防抖
    onSave() {
      defaultDebounceManager.execute(
        'save',
        this.saveData,
        1000
      )
    },
    
    performSearch(keyword) {
      console.log('执行搜索:', keyword)
      // 搜索逻辑
    },
    
    saveData() {
      console.log('保存数据')
      // 保存逻辑
    }
  }
}
```

#### 取消防抖
```javascript
import { defaultDebounceManager } from '@/utils/debounce.js'

export default {
  methods: {
    // 取消特定防抖
    cancelSearch() {
      defaultDebounceManager.cancel('search')
    },
    
    // 取消所有防抖
    cancelAllDebounce() {
      defaultDebounceManager.cancelAll()
    }
  },
  
  // 页面卸载时取消所有防抖
  onUnload() {
    defaultDebounceManager.cancelAll()
  }
}
```

---

## 实际应用场景

### 1. 搜索框输入防抖
```javascript
// pages/search/search.vue
import { debounce } from '@/utils/debounce.js'

export default {
  data() {
    return {
      searchKeyword: '',
      searchResults: []
    }
  },
  
  created() {
    // 创建搜索防抖函数
    this.debouncedSearch = debounce(this.performSearch, 500)
  },
  
  methods: {
    onInput(e) {
      this.searchKeyword = e.detail.value
      this.debouncedSearch(this.searchKeyword)
    },
    
    async performSearch(keyword) {
      if (!keyword.trim()) {
        this.searchResults = []
        return
      }
      
      try {
        // 调用搜索API
        const res = await uni.request({
          url: '/api/search',
          data: { keyword }
        })
        this.searchResults = res.data
      } catch (error) {
        console.error('搜索失败:', error)
      }
    }
  }
}
```

### 2. 表单提交防抖
```javascript
// pages/form/form.vue
import { buttonDebounce } from '@/utils/debounce.js'

export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  
  created() {
    // 创建提交防抖函数
    this.debouncedSubmit = buttonDebounce(this.submitForm, 2000)
  },
  
  methods: {
    async submitForm() {
      // 表单验证
      if (!this.validateForm()) {
        return
      }
      
      try {
        uni.showLoading({ title: '提交中...' })
        
        // 提交表单数据
        const res = await uni.request({
          url: '/api/submit',
          method: 'POST',
          data: this.formData
        })
        
        uni.showToast({ title: '提交成功' })
        // 重置表单或跳转页面
        
      } catch (error) {
        console.error('提交失败:', error)
        uni.showToast({ 
          title: '提交失败，请重试', 
          icon: 'error' 
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    validateForm() {
      // 表单验证逻辑
      return true
    }
  }
}
```

### 3. 滚动加载防抖
```javascript
// pages/list/list.vue
import { throttle } from '@/utils/debounce.js'

export default {
  data() {
    return {
      list: [],
      loading: false,
      hasMore: true
    }
  },
  
  created() {
    // 创建滚动节流函数
    this.throttledScroll = throttle(this.handleScroll, 200)
  },
  
  methods: {
    onReachBottom() {
      this.throttledScroll()
    },
    
    async handleScroll() {
      if (this.loading || !this.hasMore) {
        return
      }
      
      this.loading = true
      
      try {
        // 加载更多数据
        const res = await uni.request({
          url: '/api/list',
          data: {
            page: Math.floor(this.list.length / 10) + 1,
            size: 10
          }
        })
        
        if (res.data.length > 0) {
          this.list.push(...res.data)
        } else {
          this.hasMore = false
        }
        
      } catch (error) {
        console.error('加载失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
```

---

## 注意事项

1. **选择合适的防抖类型**:
   - 搜索输入：使用 `debounce` 延迟执行模式
   - 按钮点击：使用 `buttonDebounce` 防止重复点击
   - 滚动事件：使用 `throttle` 节流函数

2. **合理设置延迟时间**:
   - 搜索输入：300-500ms
   - 按钮点击：500-1000ms
   - 滚动事件：100-300ms

3. **异步操作处理**:
   - `buttonDebounce` 自动处理 Promise 返回值
   - 确保错误处理覆盖所有情况

4. **内存管理**:
   - 页面卸载时记得取消防抖定时器
   - 使用 `DebounceManager` 统一管理多个防抖实例

5. **Vue组件中的使用**:
   - 在 `created` 或 `mounted` 钩子中创建防抖函数
   - 避免在模板中直接调用防抖函数

## 总结

本防抖工具类提供了完整的防抖和节流解决方案，能够有效提升应用性能和用户体验。根据不同的使用场景选择合适的函数，并注意合理设置延迟时间和处理异步操作。