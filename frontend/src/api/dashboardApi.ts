import apiClient from './client';
import {
  AdminDashboard,
  ApiResponse,
  Classroom,
  Course,
  Department,
  FacultyDashboard,
  Role,
  Section,
  StudentDashboard,
  Subject,
  User,
  UserStatus
} from '../types';

export const dashboardApi = {
  getStudentDashboard: async (): Promise<StudentDashboard> => {
    const res = await apiClient.get<ApiResponse<StudentDashboard>>('/dashboard/student');
    return res.data.data;
  },

  getFacultyDashboard: async (): Promise<FacultyDashboard> => {
    const res = await apiClient.get<ApiResponse<FacultyDashboard>>('/dashboard/faculty');
    return res.data.data;
  },

  getAdminAnalytics: async (): Promise<AdminDashboard> => {
    const res = await apiClient.get<ApiResponse<AdminDashboard>>('/admin/analytics');
    return res.data.data;
  },
};

export const adminApi = {
  getUsers: async (role?: Role): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/admin/users', { params: role ? { role } : {} });
    return res.data.data;
  },

  createUser: async (payload: {
    fullName: string;
    email: string;
    collegeId: string;
    password: string;
    role: Role;
    phoneNumber?: string;
  }): Promise<User> => {
    const res = await apiClient.post<ApiResponse<User>>('/admin/users', payload);
    return res.data.data;
  },

  updateUserStatus: async (userId: number, status: UserStatus): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>(`/admin/users/${userId}/status?status=${status}`);
    return res.data.data;
  },

  getAuditLogs: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/admin/audit-logs');
    return res.data.data;
  },

  getDepartments: async (): Promise<Department[]> => {
    const res = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return res.data.data;
  },

  createDepartment: async (payload: { code: string; name: string; description?: string }): Promise<Department> => {
    const res = await apiClient.post<ApiResponse<Department>>('/departments', payload);
    return res.data.data;
  },

  getSubjects: async (departmentId?: number): Promise<Subject[]> => {
    const res = await apiClient.get<ApiResponse<Subject[]>>('/subjects', { params: departmentId ? { departmentId } : {} });
    return res.data.data;
  },

  createSubject: async (payload: { code: string; name: string; departmentId: number; credits: number; semester: number }): Promise<Subject> => {
    const res = await apiClient.post<ApiResponse<Subject>>('/subjects', payload);
    return res.data.data;
  },

  getSections: async (courseId?: number): Promise<Section[]> => {
    const res = await apiClient.get<ApiResponse<Section[]>>('/sections', { params: courseId ? { courseId } : {} });
    return res.data.data;
  },

  getClassrooms: async (): Promise<Classroom[]> => {
    const res = await apiClient.get<ApiResponse<Classroom[]>>('/classrooms');
    return res.data.data;
  },

  createClassroom: async (payload: { roomNumber: string; building: string; capacity: number }): Promise<Classroom> => {
    const res = await apiClient.post<ApiResponse<Classroom>>('/classrooms', payload);
    return res.data.data;
  },
};
