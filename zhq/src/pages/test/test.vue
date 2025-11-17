<template>
  <view class="container">
    <view class="test-section">
      <text class="title">后端连接测试</text>
      
      <button @click="testHealth" class="test-btn">测试健康检查</button>
      <text class="result">{{ healthResult }}</text>
      
      <button @click="testAuth" class="test-btn">测试登录接口</button>
      <text class="result">{{ authResult }}</text>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/index'

export default {
  data() {
    return {
      healthResult: '',
      authResult: ''
    }
  },
  methods: {
    async testHealth() {
      try {
        const result = await api.health()
        this.healthResult = `✅ 连接成功: ${result.message}`
        console.log('健康检查结果:', result)
      } catch (error) {
        this.healthResult = `❌ 连接失败: ${error.errMsg || error}`
        console.error('健康检查错误:', error)
      }
    },
    
    async testAuth() {
      try {
        // 这里需要实际的微信登录数据，暂时用测试数据
        const testData = { 
          code: 'test_code',
          userInfo: { nickName: 'test_user' }
        }
        const result = await api.wechatLogin(testData)
        this.authResult = `✅ 登录测试成功`
        console.log('登录测试结果:', result)
      } catch (error) {
        this.authResult = `❌ 登录测试失败: ${error.errMsg || error}`
        console.error('登录测试错误:', error)
      }
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  display: block;
}

.test-btn {
  margin: 10px 0;
  background: #007aff;
  color: white;
}

.result {
  display: block;
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}
</style>