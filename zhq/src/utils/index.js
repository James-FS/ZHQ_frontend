import { get, post, put } from '@/utils/request'

export const api = {
  // 健康检查
  health: () => get('/health'),
  
  // 微信登录
  wechatLogin: (data) => post('/api/v1/auth/login', data),
  
  // 用户相关
  getUserProfile: () => get('/api/v1/user/profile'),
  updateUserProfile: (data) => put('/api/v1/user/profile', data)
}