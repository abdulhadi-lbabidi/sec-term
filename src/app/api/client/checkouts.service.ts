import { ApiClient as apiClient } from '@/app/api/api-client';
import { Checkout, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const checkoutsService = {
  getCheckouts: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Checkout>>('/checkouts', { params });
    return data;
  },

  getCheckoutById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Checkout }>(`/checkouts/${id}`);
    return data.data;
  },

  createCheckout: async (payload: Partial<Checkout>) => {
    const { data } = await apiClient.post<{ data: Checkout }>('/checkouts', payload);
    return data.data;
  },

  updateCheckout: async (id: number | string, payload: Partial<Checkout>) => {
    const { data } = await apiClient.patch<{ data: Checkout }>(`/checkouts/${id}`, payload);
    return data.data;
  },

  deleteCheckout: async (id: number | string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/checkouts/${id}`);
    return data;
  },
};
