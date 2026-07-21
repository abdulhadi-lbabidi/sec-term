import { ApiClient as apiClient } from '@/app/api/api-client';
import { Order, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const ordersService = {
  getOrders: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', { params });
    return {
      data: response.data || [],
      meta: response.meta
    };
  },

  getOrderById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Order }>(`/orders/${id}`);
    return data.data;
  },

  createOrder: async (payload: { checkout_id?: number; payment_method?: string; items?: any[]; shipping?: any; total?: number }) => {
    const formData = new FormData();
    if (payload.checkout_id) formData.append('checkout_id', String(payload.checkout_id));
    if (payload.payment_method) formData.append('payment_method', String(payload.payment_method));
    
    // For backward compatibility if items are passed directly
    if (payload.items) formData.append('items', JSON.stringify(payload.items));
    if (payload.shipping) formData.append('shipping', JSON.stringify(payload.shipping));
    if (payload.total) formData.append('total', String(payload.total));

    const response = await apiClient.post<any>('/orders', formData);
    if (response.isError) {
      let errorMessage = response.message;
      if (response.errors) {
        errorMessage = Object.values(response.errors)[0]?.[0] || response.message;
      }
      throw new Error(errorMessage || 'Failed to create order');
    }
    return response.data?.data || response.data;
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
