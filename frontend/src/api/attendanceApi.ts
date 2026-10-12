import apiClient from './client';
import { ApiResponse, AttendanceRecord, AttendanceSession, AttendanceSummary } from '../types';

export const attendanceApi = {
  startSession: async (payload: {
    subjectId: number;
    sectionId: number;
    classroomId?: number;
    durationMinutes: number;
    geofenceEnabled: boolean;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
  }): Promise<AttendanceSession> => {
    const res = await apiClient.post<ApiResponse<AttendanceSession>>('/attendance/sessions', payload);
    return res.data.data;
  },

  getMySessions: async (): Promise<AttendanceSession[]> => {
    const res = await apiClient.get<ApiResponse<AttendanceSession[]>>('/attendance/sessions');
    return res.data.data;
  },

  getSession: async (id: number): Promise<AttendanceSession> => {
    const res = await apiClient.get<ApiResponse<AttendanceSession>>(`/attendance/sessions/${id}`);
    return res.data.data;
  },

  getSessionRecords: async (id: number): Promise<AttendanceRecord[]> => {
    const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>(`/attendance/sessions/${id}/records`);
    return res.data.data;
  },

  closeSession: async (id: number): Promise<AttendanceSession> => {
    const res = await apiClient.post<ApiResponse<AttendanceSession>>(`/attendance/sessions/${id}/close`);
    return res.data.data;
  },

  checkIn: async (payload: { qrToken: string; latitude?: number; longitude?: number }): Promise<AttendanceRecord> => {
    const res = await apiClient.post<ApiResponse<AttendanceRecord>>('/attendance/check-in', payload);
    return res.data.data;
  },

  getMyRecords: async (): Promise<AttendanceRecord[]> => {
    const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>('/attendance/my-records');
    return res.data.data;
  },

  getSummary: async (): Promise<AttendanceSummary> => {
    const res = await apiClient.get<ApiResponse<AttendanceSummary>>('/attendance/summary');
    return res.data.data;
  },

  exportCsvUrl: (sessionId?: number): string => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    return sessionId ? `${base}/attendance/reports/export-csv?sessionId=${sessionId}` : `${base}/attendance/reports/export-csv`;
  },
};
