import apiClient from './client';
import { ApiResponse, TimetableEntry } from '../types';

export const timetableApi = {
  getMyTimetable: async (): Promise<TimetableEntry[]> => {
    const res = await apiClient.get<ApiResponse<TimetableEntry[]>>('/timetable/my');
    return res.data.data;
  },

  getTimetable: async (params?: { sectionId?: number; facultyId?: number }): Promise<TimetableEntry[]> => {
    const res = await apiClient.get<ApiResponse<TimetableEntry[]>>('/timetable', { params });
    return res.data.data;
  },

  createTimetable: async (payload: {
    subjectId: number;
    facultyId: number;
    sectionId: number;
    classroomId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }): Promise<TimetableEntry> => {
    const res = await apiClient.post<ApiResponse<TimetableEntry>>('/admin/timetable', payload);
    return res.data.data;
  },

  updateTimetable: async (id: number, payload: any): Promise<TimetableEntry> => {
    const res = await apiClient.put<ApiResponse<TimetableEntry>>(`/admin/timetable/${id}`, payload);
    return res.data.data;
  },

  deleteTimetable: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/timetable/${id}`);
  },
};
