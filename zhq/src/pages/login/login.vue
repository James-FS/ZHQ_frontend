<template>
  <view class="container">
    <!-- 顶部标签切换 -->
    <view class="tabs">
      <view class="tab-item" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">
        <text class="tab-text" :class="{ 'active-text': activeTab === 'login' }">登录</text>
        <view class="tab-line" v-if="activeTab === 'login'"></view>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">
        <text class="tab-text" :class="{ 'active-text': activeTab === 'register' }">注册</text>
        <view class="tab-line" v-if="activeTab === 'register'"></view>
      </view>
    </view>

    <!-- 登录页面 -->
    <view v-if="activeTab === 'login'" class="form-container">
      <view class="zhihuiquan">智汇圈</view>


      <!-- 账号输入框 -->
      <view class="form-item">
        <text class="label">账号</text>
        <input class="input" v-model="loginForm.account" placeholder="请输入账号" placeholder-class="placeholder" />
      </view>

      <!-- 密码输入框 -->
      <view class="form-item">
        <view class="label-row">
          <text class="label">密码</text>
          <text class="forgot-text">忘记密码?</text>
        </view>
        <view class="password-input-wrapper">
          <input class="input" v-model="loginForm.password" :password="!loginForm.showPassword" placeholder="请输入密码"
            placeholder-class="placeholder" />
          <text class="eye-icon iconfont" :class="loginForm.showPassword ? 'icon-eye' : 'icon-eye-close'"
            @click="togglePasswordVisibility('login')">
          </text>
        </view>
      </view>

      <!-- 登录按钮 -->
      <button class="submit-btn" @click="handleLogin">登录</button>

      <!-- 协议勾选 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="agreed" />
            <text class="agreement-text">我已阅读并同意《用户协议》和《隐私政策》</text>
          </label>
        </checkbox-group>
      </view>

      <!-- 第三方登录按钮 -->
      <view class="third-party-login">
        <view class="login-icon-wrapper" @click="handleWechatLogin">
          <text class="iconfont icon-wechat icon-weixin"></text>
        </view>
        <view class="login-icon-wrapper">
          <text class="iconfont icon-QQ icon-qq"></text>
        </view>
      </view>
    </view>

    <!-- 注册页面 -->
    <view v-if="activeTab === 'register'" class="form-container">
      <view class="zhihuiquan">智汇圈</view>


      <!-- 账号输入框 -->
      <view class="form-item">
        <text class="label">账号</text>
        <input class="input" v-model="registerForm.account" placeholder="请输入账号" placeholder-class="placeholder" />
      </view>

      <!-- 密码输入框 -->
      <view class="form-item">
        <text class="label">密码</text>
        <view class="password-input-wrapper">
          <input class="input" v-model="registerForm.password" :password="!registerForm.showPassword"
            placeholder="请输入密码" placeholder-class="placeholder" />
          <text class="eye-icon iconfont" :class="registerForm.showPassword ? 'icon-eye' : 'icon-eye-close'"
            @click="togglePasswordVisibility('register')">
          </text>
        </view>
      </view>

      <!-- 确认密码输入框 -->
      <view class="form-item">
        <text class="label">确认密码</text>
        <view class="password-input-wrapper">
          <input class="input" v-model="registerForm.confirmPassword" :password="!registerForm.showConfirmPassword"
            placeholder="请再次输入密码" placeholder-class="placeholder" />
          <text class="eye-icon iconfont" :class="registerForm.showConfirmPassword ? 'icon-eye' : 'icon-eye-close'"
            @click="toggleConfirmPasswordVisibility">
          </text>
        </view>
      </view>

      <!-- 注册按钮 -->
      <button class="submit-btn" @click="handleRegister">注册</button>

      <!-- 协议勾选 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="agreed" />
            <text class="agreement-text">我已阅读并同意《用户协议》和《隐私政策》</text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/index'
export default {
  data() {
    return {
      activeTab: 'login', // 当前激活的标签：'login' 或 'register'
      agreed: false, // 是否同意协议
      loginForm: {
        account: '',
        password: '',
        showPassword: false
      },
      registerForm: {
        account: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false
      }
    }
  },
  methods: {
    // 切换标签
    switchTab(tab) {
      this.activeTab = tab
    },

    // 切换密码可见性（登录/注册）
    togglePasswordVisibility(type) {
      if (type === 'login') {
        this.loginForm.showPassword = !this.loginForm.showPassword
      } else {
        this.registerForm.showPassword = !this.registerForm.showPassword
      }
    },

    // 切换确认密码可见性
    toggleConfirmPasswordVisibility() {
      this.registerForm.showConfirmPassword = !this.registerForm.showConfirmPassword
    },

    // 协议勾选变化
    handleAgreementChange(e) {
      this.agreed = e.detail.value.length > 0
    },

    // login.vue 的 methods 中

connectWebSocket(token) {
  // ✅ 第一步：创建连接
  uni.connectSocket({
    url: 'ws://localhost:8080/api/v1/chat/ws',
    header: {
      'Authorization': `Bearer ${token}`
    },
    success: (res) => {
      console.log('连接成功');
    }
  });

  // ✅ 第二步：获取 SocketTask（关键！）
  // 等待连接打开后再获取
  uni.onSocketOpen(() => {
    // 在这里获取 SocketTask
    uni.$chatSocket = {
      send: (data) => {
        uni.sendSocketMessage({
          data: data,
          success: () => console.log('✅ 已发送'),
          fail: (err) => console.error('❌ 发送失败', err)
        });
      },
      close: () => {
        uni.closeSocket({
          code: 1000,
          reason: '正常关闭'
        });
      }
    };

    console.log('✅ WebSocket 已连接');
    uni.$wsConnected = true;
  });

  uni.onSocketMessage((res) => {
    console.log('📨 收到消息:', res. data);
  });

  uni.onSocketError(() => {
    console.error('❌ WebSocket 连接错误');
    uni.$wsConnected = false;
  });

  uni.onSocketClose(() => {
    console.log('WebSocket 已关闭');
    uni.$wsConnected = false;
  });
},

    // 处理登录
    handleLogin() {
      if (!this.agreed) {
        uni.showToast({
          title: '请先同意用户协议',
          icon: 'none'
        })
        return
      }

      if (!this.loginForm.account || !this.loginForm.password) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      // 调用后端手机号密码登录接口（账号即手机号）
      uni.showLoading({ title: '登录中...' })
      api.phoneLogin({
        phone: this.loginForm.account,
        password: this.loginForm.password
      })
        .then(res => {
          uni.hideLoading()
          if (res.code === 0) {
            // 登录成功，保存token和用户信息（后端返回 data.token 与 data.user）
            uni.setStorageSync('token', res.data.token)
            uni.setStorageSync('userInfo', res.data.user)
            this.connectWebSocket(res.data.token);
            console.log('登录成功，token为：', res.data.token)

            uni.showToast({
              title: '登录成功',
              icon: 'success'
            })

            // 跳转到首页或之前的页面
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/square/square'
              })
            }, 1500)
          } else {
            // 登录失败，显示错误信息
            uni.showToast({
              title: res.message || '登录失败',
              icon: 'none'
            })
          }
        })
        .catch(err => {
          uni.hideLoading()
          console.error('登录请求失败：', err)
          uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
          })
        })
    },

    // 处理注册
    handleRegister() {
      if (!this.agreed) {
        uni.showToast({
          title: '请先同意用户协议',
          icon: 'none'
        })
        return
      }

      if (!this.registerForm.account || !this.registerForm.password || !this.registerForm.confirmPassword) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        uni.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
        return
      }

      // 调用后端注册接口（账号即手机号）
      uni.showLoading({ title: '注册中...' })
      api.registerByPhone({
        phone: this.registerForm.account,
        password: this.registerForm.password
      })
        .then(res => {
          uni.hideLoading()
          if (res.code === 0) {
            uni.showToast({ title: res.message || '注册成功', icon: 'success' })
            // 注册成功后切回登录页
            this.switchTab('login')
          } else {
            uni.showToast({ title: res.message || '注册失败', icon: 'none' })
          }
        })
        .catch(err => {
          uni.hideLoading()
          console.error('注册请求失败：', err)
          uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
        })
    },

    // 处理微信登录
    handleWechatLogin() {
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          console.log('微信登录成功：', loginRes)

          // 获取用户信息
          uni.getUserInfo({
            provider: 'weixin',
            success: (infoRes) => {
              console.log('用户信息：', infoRes)

              // 调用后端微信登录接口
              uni.showLoading({ title: '登录中...' })
              api.wechatLogin({
                code: loginRes.code,
                userInfo: infoRes.userInfo
              })
                .then(res => {
                  uni.hideLoading()
                  if (res.code === 0) {
                    // 登录成功，保存token和用户信息
                    uni.setStorageSync('token', res.data.token)
                    uni.setStorageSync('userInfo', res.data.userInfo)
                    console.log('登录成功，token为：', res.data.token)

                    uni.showToast({
                      title: '微信登录成功',
                      icon: 'success'
                    })

                    // 跳转到首页
                    setTimeout(() => {
                      uni.switchTab({
                        url: '/pages/square/square'
                      })
                    }, 1500)
                  } else {
                    uni.showToast({
                      title: res.message || '登录失败',
                      icon: 'none'
                    })
                  }
                })
                .catch(err => {
                  uni.hideLoading()
                  console.error('微信登录请求失败：', err)
                  uni.showToast({
                    title: '网络错误，请稍后重试',
                    icon: 'none'
                  })
                })
            },
            fail: (err) => {
              console.error('获取用户信息失败：', err)
              uni.showToast({
                title: '获取用户信息失败',
                icon: 'none'
              })
            }
          })
        },
        fail: (err) => {
          console.error('微信登录失败：', err)
          uni.showToast({
            title: '微信登录失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 0 40rpx;
  background-color: #f5f5f5;
}

/* 标签切换 */
.tabs {
  display: flex;
  padding-top: 40rpx;
  margin-bottom: 60rpx;
}

.tab-item {
  position: relative;
  margin-right: 60rpx;
  padding-bottom: 20rpx;
}

.tab-text {
  font-size: 32rpx;
  color: #999;
  font-weight: normal;
}

.active-text {
  color: #333;
  font-weight: bold;
  font-size: 36rpx;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background: linear-gradient(to right, #4fc3f7, #29b6f6);
  border-radius: 3rpx;
}

/* 表单容器 */
.form-container {
  padding-top: 20rpx;
}

.zhihuiquan {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  text-align: center;
}


/* 表单项 */
.form-item {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.forgot-text {
  font-size: 26rpx;
  color: #666;
}

.input {
  width: 100%;
  height: 88rpx;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.placeholder {
  color: #ccc;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .input {
  padding-right: 80rpx;
}

.eye-icon {
  position: absolute;
  right: 30rpx;
  font-size: 40rpx;
  cursor: pointer;
  color: #999;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(to right, #4fc3f7, #29b6f6);
  border-radius: 20rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
  line-height: 88rpx;
}

.submit-btn::after {
  border: none;
}

/* 协议 */
.agreement {
  display: flex;
  justify-content: center;
}

.agreement-label {
  display: flex;
  align-items: center;
}

.agreement-text {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

checkbox {
  transform: scale(0.7);
}

/* 第三方登录 */
.third-party-login {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80rpx;
  gap: 80rpx;
}

.login-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.login-icon-wrapper .iconfont {
  font-size: 80rpx;
  color: #09bb07;
}

.icon-wechat {
  color: #09bb07;
}

.login-icon-wrapper .icon-QQ {
  color: #12b7f5;
}
</style>