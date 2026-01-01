// 配置后端服务器地址
const baseURL = 'http://localhost:8080' // 开发环境
//const baseURL = 'http://182.254.171.24:8080' // 生产环境

const request = (options) => {
  // 获取本地存储的token
  const token = uni.getStorageSync('token')

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，返回401状态，不强制跳转登录页
          resolve({ code: 401, message: '未登录', data: null });
        } else {
          reject(res.data || new Error('请求失败'));
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// WebSocket连接配置
export const connectWebSocket = (token) => {
  const wsURL = baseURL.replace('http', 'ws') + '/api/v1/chat/ws'
  
  // 创建连接
  uni.connectSocket({
    url: wsURL,
    header: {
      'Authorization': `Bearer ${token}`
    },
    success: (res) => {
      console.log('WebSocket连接中...')
    }
  })

  // 监听连接打开
  uni.onSocketOpen(() => {
    uni.$chatSocket = {
      send: (data) => {
        uni.sendSocketMessage({
          data: data,
          success: () => console.log('✅ 已发送'),
          fail: (err) => console.error('❌ 发送失败', err)
        })
      },
      close: () => {
        uni.closeSocket({
          code: 1000,
          reason: '正常关闭'
        })
      }
    }
    console.log('✅ WebSocket 已连接')
    uni.$wsConnected = true
  })

  // 监听接收消息
  uni.onSocketMessage((res) => {
    console.log('📨 收到消息:', res.data)
  })

  // 监听连接错误
  uni.onSocketError(() => {
    console.error('❌ WebSocket 连接错误')
    uni.$wsConnected = false
  })

  // 监听连接关闭
  uni.onSocketClose(() => {
    console.log('WebSocket 已关闭')
    uni.$wsConnected = false
  })
}

// 导出请求方法
export const get = (url, data = {}) => request({ url, method: 'GET', data })
export const post = (url, data = {}) => request({ url, method: 'POST', data })
export const put = (url, data = {}) => request({ url, method: 'PUT', data })
export const del = (url, data = {}) => request({ url, method: 'DELETE', data })

export default request