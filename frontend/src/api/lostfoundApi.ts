import apiClient from './client';
import { ApiResponse, ClaimStatus, ItemCategory, ItemStatus, ItemType, LostFoundClaim, LostFoundItem } from '../types';

export const lostfoundApi = {
  getItems: async (params?: { type?: ItemType; category?: ItemCategory; status?: ItemStatus; query?: string }): Promise<LostFoundItem[]> => {
    const res = await apiClient.get<ApiResponse<LostFoundItem[]>>('/lost-found', { params });
    return res.data.data;
  },

  getItemById: async (id: number): Promise<LostFoundItem> => {
    const res = await apiClient.get<ApiResponse<LostFoundItem>>(`/lost-found/${id}`);
    return res.data.data;
  },

  createItem: async (payload: {
    title: string;
    description: string;
    category: ItemCategory;
    itemType: ItemType;
    location: string;
    dateRecorded?: string;
    imageUrl?: string;
  }): Promise<LostFoundItem> => {
    const res = await apiClient.post<ApiResponse<LostFoundItem>>('/lost-found', payload);
    return res.data.data;
  },

  getMyItems: async (): Promise<LostFoundItem[]> => {
    const res = await apiClient.get<ApiResponse<LostFoundItem[]>>('/lost-found/my');
    return res.data.data;
  },

  submitClaim: async (itemId: number, descriptionProof: string): Promise<LostFoundClaim> => {
    const res = await apiClient.post<ApiResponse<LostFoundClaim>>(`/lost-found/${itemId}/claims`, { descriptionProof });
    return res.data.data;
  },

  getItemClaims: async (itemId: number): Promise<LostFoundClaim[]> => {
    const res = await apiClient.get<ApiResponse<LostFoundClaim[]>>(`/lost-found/${itemId}/claims`);
    return res.data.data;
  },

  getMyClaims: async (): Promise<LostFoundClaim[]> => {
    const res = await apiClient.get<ApiResponse<LostFoundClaim[]>>('/lost-found/claims/my');
    return res.data.data;
  },

  reviewClaim: async (claimId: number, status: ClaimStatus, resolutionNotes?: string): Promise<LostFoundClaim> => {
    const res = await apiClient.patch<ApiResponse<LostFoundClaim>>(`/lost-found/claims/${claimId}/review`, { status, resolutionNotes });
    return res.data.data;
  },

  updateStatus: async (id: number, status: ItemStatus): Promise<LostFoundItem> => {
    const res = await apiClient.patch<ApiResponse<LostFoundItem>>(`/lost-found/${id}/status?status=${status}`);
    return res.data.data;
  },
};
