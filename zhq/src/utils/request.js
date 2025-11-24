// 配置后端服务器地址
const baseURL = 'http://localhost:8080' // 开发环境
// const baseURL = 'https://your-domain.com' // 生产环境

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
         'Authorization': token ? `Bearer ${token}` : '',// 在所有请求中添加token
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，跳转到登录页
          uni.navigateTo({ url: '/pages/login/login' });
          reject(new Error('请先登录'));
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

// 导出请求方法
export const get = (url, data = {}) => request({ url, method: 'GET', data })
export const post = (url, data = {}) => request({ url, method: 'POST', data })
export const put = (url, data = {}) => request({ url, method: 'PUT', data })
export const del = (url, data = {}) => request({ url, method: 'DELETE', data })

export default request