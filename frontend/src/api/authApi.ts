import apiClient from './client';
import { ApiResponse, AuthResponse, User } from '../types';

export const authApi = {
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { identifier, password });
    return res.data.data;
  },

  register: async (payload: {
    fullName: string;
    email: string;
    collegeId: string;
    password: string;
    role: string;
    phoneNumber?: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('smart_campus_access_token');
      localStorage.removeItem('smart_campus_refresh_token');
      localStorage.removeItem('smart_campus_user');
    }
  },

  updateProfile: async (payload: { fullName?: string; phoneNumber?: string; avatarUrl?: string }): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>('/users/me', payload);
    return res.data.data;
  },
};
