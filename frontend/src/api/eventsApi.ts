import apiClient from './client';
import { ApiResponse, CampusEvent, EventCategory, EventStatus } from '../types';

export const eventsApi = {
  getEvents: async (params?: { category?: EventCategory; status?: EventStatus; search?: string }): Promise<CampusEvent[]> => {
    const res = await apiClient.get<ApiResponse<CampusEvent[]>>('/events', { params });
    return res.data.data;
  },

  getEventById: async (id: number): Promise<CampusEvent> => {
    const res = await apiClient.get<ApiResponse<CampusEvent>>(`/events/${id}`);
    return res.data.data;
  },

  createEvent: async (payload: {
    title: string;
    description: string;
    category: EventCategory;
    venue: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    imageUrl?: string;
  }): Promise<CampusEvent> => {
    const res = await apiClient.post<ApiResponse<CampusEvent>>('/events', payload);
    return res.data.data;
  },

  rsvpEvent: async (id: number): Promise<void> => {
    await apiClient.post(`/events/${id}/rsvp`);
  },

  cancelRsvp: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}/rsvp`);
  },
};
