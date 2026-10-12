import apiClient from './client';
import { AnnouncementItem, ApiResponse, NotificationItem } from '../types';

export const notificationApi = {
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    const res = await apiClient.get<ApiResponse<NotificationItem[]>>('/notifications');
    return res.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data.data.unreadCount;
  },

  markRead: async (id: number): Promise<NotificationItem> => {
    const res = await apiClient.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};

export const announcementApi = {
  getAnnouncements: async (): Promise<AnnouncementItem[]> => {
    const res = await apiClient.get<ApiResponse<AnnouncementItem[]>>('/announcements');
    return res.data.data;
  },

  createAnnouncement: async (payload: {
    title: string;
    content: string;
    targetRole: string;
    priority: string;
  }): Promise<AnnouncementItem> => {
    const res = await apiClient.post<ApiResponse<AnnouncementItem>>('/announcements', payload);
    return res.data.data;
  },
};
