import { ApiClient as apiClient } from '@/app/api/api-client';
import { Cart } from '@/lib/types/api.types';

export const cartService = {
  getCart: async () => {
    const { data } = await apiClient.get<{ data: Cart }>('/cart');
    return data.data;
  },

  addToCart: async (payload: { product_variant_id?: number; product_variant_package_id?: number; quantity: number }) => {
    const { data } = await apiClient.post<{ data: Cart }>('/cart', payload);
    return data;
  },

  updateCartItem: async (id: number | string, payload: { quantity: number }) => {
    const { data } = await apiClient.put<{ data: Cart }>(`/cart/${id}`, payload);
    return data.data;
  },

  removeCartItem: async (id: number | string) => {
    const { data } = await apiClient.delete<{ data: Cart }>(`/cart/${id}`);
    return data.data;
  },

  clearCart: async () => {
    const { data } = await apiClient.delete<{ message: string }>('/cart-clear');
    return data;
  },
};
