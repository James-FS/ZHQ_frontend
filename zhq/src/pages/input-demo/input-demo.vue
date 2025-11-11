<template>
  <view class="input-demo">
    <view class="demo-header">
      <text class="demo-title">输入框组件演示</text>
    </view>
    
    <scroll-view class="demo-content" scroll-y>
      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        
        <common-input
          label="用户名"
          placeholder="请输入用户名"
          v-model:value="form.username"
          :required="true"
          :rules="usernameRules"
          @input="onUsernameInput"
        />
        
        <common-input
          label="密码"
          type="password"
          placeholder="请输入密码"
          v-model:value="form.password"
          :required="true"
          :rules="passwordRules"
        />
        
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
      
      <!-- 不同尺寸 -->
      <view class="demo-section">
        <text class="section-title">不同尺寸</text>
        
        <common-input
          label="小尺寸"
          size="small"
          placeholder="小尺寸输入框"
          v-model:value="form.small"
        />
        
        <common-input
          label="中尺寸"
          size="medium"
          placeholder="中尺寸输入框"
          v-model:value="form.medium"
        />
        
        <common-input
          label="大尺寸"
          size="large"
          placeholder="大尺寸输入框"
          v-model:value="form.large"
        />
      </view>
      
      <!-- 不同边框风格 -->
      <view class="demo-section">
        <text class="section-title">不同边框风格</text>
        
        <common-input
          label="线条风格"
          border-style="line"
          placeholder="线条风格输入框"
          v-model:value="form.lineStyle"
        />
        
        <common-input
          label="卡片风格"
          border-style="card"
          placeholder="卡片风格输入框"
          v-model:value="form.cardStyle"
        />
      </view>
      
      <!-- 特殊状态 -->
      <view class="demo-section">
        <text class="section-title">特殊状态</text>
        
        <common-input
          label="禁用状态"
          placeholder="禁用的输入框"
          v-model:value="form.disabled"
          :disabled="true"
        />
        
        <common-input
          label="只读状态"
          placeholder="只读的输入框"
          v-model:value="form.readonly"
          :readonly="true"
        />
        
        <common-input
          label="不可清空"
          placeholder="不显示清空按钮"
          v-model:value="form.noClear"
          :clearable="false"
        />
      </view>
      
      <!-- 多行输入演示 -->
      <view class="demo-section">
        <text class="section-title">多行输入</text>
        <text class="section-desc">注意：密码类型的输入框不支持多行输入，即使设置了multiline也会使用单行模式</text>
        
        <common-input
          label="简介"
          :multiline="true"
          placeholder="请输入个人简介..."
          v-model:value="form.description"
          :show-word-limit="false"
          :clearable="false"
        />
        
        <common-input
          label="详细地址"
          :multiline="true"
          border-style="line"
          placeholder="请输入详细地址"
          v-model:value="form.address"
          :maxlength="500"
          :show-word-limit="true"
        />
        
        
      </view>
      
      <!-- 表单验证演示 -->
      <view class="demo-section">
        <text class="section-title">表单验证</text>
        
        <common-input
          label="邮箱"
          type="email"
          placeholder="请输入邮箱地址"
          v-model:value="form.email"
          :rules="emailRules"
          ref="emailInput"
        />
        
        <common-input
          label="确认密码"
          type="password"
          placeholder="请再次输入密码"
          v-model:value="form.confirmPassword"
          :rules="confirmPasswordRules"
        />
        
        <view class="demo-buttons">
          <button class="demo-btn" @click="validateForm">验证表单</button>
          <button class="demo-btn" @click="resetForm">重置表单</button>
        </view>
      </view>
      
      <!-- 表单数据展示 -->
      <view class="demo-section">
        <text class="section-title">表单数据</text>
        <view class="form-data">
          <text class="data-text">{{ JSON.stringify(form, null, 2) }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'InputDemo',
  
  data() {
    return {
      form: {
        username: '',
        password: '',
        phone: '',
        email: '',
        confirmPassword: '',
        small: '',
        medium: '',
        large: '',
        lineStyle: '',
        cardStyle: '',
        disabled: '禁用状态演示',
        readonly: '只读状态演示',
        noClear: '不可清空演示',
        description: '',
        address: '',
        remarks: '',
      },
      
      usernameRules: [
        { required: true, message: '用户名不能为空' },
        { min: 3, max: 20, message: '用户名长度为3-20个字符' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
      ],
      
      passwordRules: [
        { required: true, message: '密码不能为空' },
        { min: 6, message: '密码长度不能少于6位' },
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
      ],
      
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
    confirmPasswordRules() {
      return [
        { required: true, message: '确认密码不能为空' },
        { 
          validator: (value) => {
            if (value !== this.form.password) {
              return '两次输入的密码不一致'
            }
            return true
          }
        }
      ]
    }
  },
  
  methods: {
    onUsernameInput(value) {
      console.log('用户名输入:', value)
    },
    
    validateForm() {
      // 这里可以调用所有输入框的验证方法
      let isValid = true
      
      // 示例：验证邮箱输入框
      if (this.$refs.emailInput && !this.$refs.emailInput.validate()) {
        isValid = false
      }
      
      if (isValid) {
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
      this.form = {
        username: '',
        password: '',
        phone: '',
        email: '',
        confirmPassword: '',
        small: '',
        medium: '',
        large: '',
        lineStyle: '',
        cardStyle: '',
        disabled: '禁用状态演示',
        readonly: '只读状态演示',
        noClear: '不可清空演示',
        description: '',
        address: '',
        remarks: '',
        passwordTest: ''
      }
      
      uni.showToast({
        title: '表单已重置',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.input-demo {
  min-height: 100vh;
  background: #F5F5F5;
}

.demo-header {
  background: #FFFFFF;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.demo-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.demo-content {
  padding: 40rpx 30rpx;
  max-width: 750rpx;
  margin: 0 auto;
  box-sizing: border-box;
}

.demo-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 4rpx solid #F0F0F0;
}

.section-desc {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background-color: #F8F9FA;
  border-radius: 8rpx;
  border-left: 6rpx solid #409EFF;
}

.demo-buttons {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
}

.demo-btn {
  flex: 1;
  height: 88rpx;
  background: $uni-color-primary;
  color: #FFFFFF;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;

}

.form-data {
  background: #F8F8F8;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  word-break: break-all;
}

.data-text {
  font-size: 24rpx;
  color: #666666;
  font-family: monospace;
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>