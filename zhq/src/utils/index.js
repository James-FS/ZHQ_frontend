import { get, post, put, del } from '@/utils/request'

export const api = {
  // 健康检查
  health: () => get('/health'),
  
  // 微信登录
  wechatLogin: (data) => post('/api/v1/auth/login', data),
  // 手机号+密码登录
  phoneLogin: (data) => post('/api/v1/auth/phone-login', data),
  // 手机号注册
  registerByPhone: (data) => post('/api/v1/auth/register', data),
  
  // 用户相关
  getUserProfile: () => get('/api/v1/user/profile'),
  updateUserProfile: (data) => put('/api/v1/user/profile', data),

  // 队伍相关
  createTeam: (data) => post('/api/v1/teams', data), // 创建队伍
  getTeamList: () => get('/api/v1/teams'), // 获取队伍列表
  getTeamDetails: (id) => get(`/api/v1/teams/details`, { team_id: id }), // 获取队伍详情
  updateTeam: (id, data) => put(`/api/v1/teams/${id}`, data), // 更新队伍信息
  deleteTeam: (id) => del(`/api/v1/teams/${id}`), // 删除队伍

  //收藏相关
  removeCollection: (id) => del(`/api/v1/user/collection?team_id=${id}`)

  //连接ws
  
}