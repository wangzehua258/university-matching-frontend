import axios from 'axios';

// API基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户相关API
export const userAPI = {
  // 用户登录
  login: async (phone: string) => {
    const response = await api.post('/users/login', { phone });
    return response.data;
  },

  // 用户注册
  register: async (phone: string, role: 'parent' | 'student') => {
    const response = await api.post('/users/register', { phone, role });
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// 大学相关API
export const universityAPI = {
  // 获取大学列表
  getUniversities: async (params?: {
    country?: string;
    rank_min?: number;
    rank_max?: number;
    tuition_max?: number;
    type?: string;
    strength?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }) => {
    const response = await api.get('/universities', { params });
    return response.data;
  },

  // 获取大学详情
  getUniversity: async (id: string) => {
    const response = await api.get(`/universities/${id}`);
    return response.data;
  },

  // 获取国家列表
  getCountries: async () => {
    const response = await api.get('/universities/countries/list');
    return response.data;
  },

  // 获取优势专业列表
  getStrengths: async () => {
    const response = await api.get('/universities/strengths/list');
    return response.data;
  },
};

// 评估相关API
export const evaluationAPI = {
  // 创建家长评估
  createParentEvaluation: async (data: Record<string, unknown>) => {
    const response = await api.post('/evals/parent', data);
    return response.data;
  },

  // 获取家长评估结果
  getParentEvaluation: async (id: string) => {
    const response = await api.get(`/evals/parent/${id}`);
    return response.data;
  },

  // 创建学生人格测评
  createStudentTest: async (data: Record<string, unknown>) => {
    const response = await api.post('/evals/student', data);
    return response.data;
  },

  // 获取学生人格测评结果
  getStudentTest: async (id: string) => {
    const response = await api.get(`/evals/student/${id}`);
    return response.data;
  },
};

// GPT相关API
export const gptAPI = {
  // 生成推荐理由
  generateRecommendation: async (data: {
    university_name: string;
    student_interests: string[];
    student_profile: string;
  }) => {
    const response = await api.post('/gpt/recommendation', data);
    return response.data;
  },
};

export default api; 