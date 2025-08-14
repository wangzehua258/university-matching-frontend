import axios from 'axios';
import { getAnonymousUserId } from './useAnonymousUser';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 评估相关API
export const evaluationAPI = {
  // 创建家长评估
  createParentEvaluation: async (data: Record<string, unknown>) => {
    const userId = getAnonymousUserId();
    // 确保数据格式正确
    const requestData = {
      ...data,
      user_id: userId
    };
    const response = await api.post('/evals/parent', requestData);
    return response.data;
  },

  // 根据ID获取家长评估
  getParentEvaluation: async (evalId: string) => {
    const response = await api.get(`/evals/parent/${evalId}`);
    return response.data;
  },

  // 根据用户ID获取家长评估列表
  getParentEvaluationByUserId: async (userId: string) => {
    const response = await api.get(`/evals/parent/user/${userId}`);
    return response.data;
  },

  // 创建学生测评
  createStudentTest: async (data: Record<string, unknown>) => {
    const userId = getAnonymousUserId();
    const response = await api.post('/evals/student', { ...data, user_id: userId });
    return response.data;
  },

  // 根据ID获取学生测评
  getStudentTest: async (testId: string) => {
    const response = await api.get(`/evals/student/${testId}`);
    return response.data;
  },

  // 根据用户ID获取学生测评列表
  getStudentTestByUserId: async (userId: string) => {
    const response = await api.get(`/evals/student/user/${userId}`);
    return response.data;
  },
};

// 大学相关API
export const universityAPI = {
  // 获取所有大学
  getAllUniversities: async () => {
    const response = await api.get('/universities');
    return response.data;
  },

  // 获取大学列表（支持筛选）
  getUniversities: async (params?: Record<string, string | number>) => {
    const response = await api.get('/universities', { params });
    return response.data;
  },

  // 根据ID获取大学详情
  getUniversityById: async (id: string) => {
    const response = await api.get(`/universities/${id}`);
    return response.data;
  },

  // 搜索大学
  searchUniversities: async (query: string) => {
    const response = await api.get(`/universities/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // 根据条件筛选大学
  filterUniversities: async (filters: Record<string, unknown>) => {
    const response = await api.get('/universities/filter', { params: filters });
    return response.data;
  },

  // 获取所有国家列表
  getCountries: async () => {
    const response = await api.get('/universities/countries/list');
    return response.data;
  },

  // 获取所有优势专业列表
  getStrengths: async () => {
    const response = await api.get('/universities/strengths/list');
    return response.data;
  },
};

// 用户相关API
export const userAPI = {
  // 创建匿名用户
  createAnonymousUser: async () => {
    const response = await api.post('/users/anonymous');
    return response.data;
  },

  // 根据ID获取用户信息
  getUserById: async (userId: string) => {
    const response = await api.get(`/users/anonymous/${userId}`);
    return response.data;
  },
}; 