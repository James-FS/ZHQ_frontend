import { get, post, put, del } from '@/utils/request'

export const api = {
  // 健康检查
  health: () => get('/health'),

  // 微信登录
  wechatLogin: (data) => post('/api/v1/auth/login', data),

  // 用户相关
  getUserProfile: () => get('/api/v1/user/profile'),
  updateUserProfile: (data) => put('/api/v1/user/profile', data),

  // 队伍相关
  createTeam: (data) => post('/api/v1/teams', data), // 创建队伍
  getTeamList: () => get('/api/v1/teams'), // 获取队伍列表
  getTeamDetail: (id) => get(`/api/v1/teams/${id}`), // 获取队伍详情
  updateTeam: (id, data) => put(`/api/v1/teams/${id}`, data), // 更新队伍信息
  deleteTeam: (id) => del(`/api/v1/teams/${id}`), // 删除队伍

  // 简历相关
  getResumeList: () => get('/api/v1/resumes'), // 获取简历列表
  uploadResume: (data) => post('/api/v1/resumes/upload', data), // 上传简历
  deleteResume: (id) => del(`/api/v1/resumes/${id}`), // 删除简历
  setDefaultResume: (id) => put(`/api/v1/resumes/${id}/default`) // 设置默认简历
}