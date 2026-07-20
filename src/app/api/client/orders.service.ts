import { ApiClient as apiClient } from '@/app/api/api-client';
import { Order, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const ordersService = {
  getOrders: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders', { params });
    return data;
  },

  getOrderById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Order }>(`/orders/${id}`);
    return data.data;
  },

  createOrder: async (payload: { checkout_id?: number; items?: any[]; shipping?: any; total?: number }) => {
    const { data } = await apiClient.post<{ data: Order }>('/orders', payload);
    return data.data;
  },

  updateOrder: async (id: number | string, payload: Partial<Order>) => {
    const { data } = await apiClient.patch<{ data: Order }>(`/orders/${id}`, payload);
    return data.data;
  },

  deleteOrder: async (id: number | string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/orders/${id}`);
    return data;
  },
};
