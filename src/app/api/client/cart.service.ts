import { ApiClient as apiClient } from '@/app/api/api-client';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<any>('/cart');
    if (response.isError) throw new Error(response.message);
    return response.data?.data || response.data;
  },

  addToCart: async (payload: { product_variant_id?: number; product_variant_package_id?: number; quantity: number }) => {
    const formData = new FormData();
    if (payload.product_variant_id) formData.append('product_variant_id', payload.product_variant_id.toString());
    if (payload.product_variant_package_id) formData.append('product_variant_package_id', payload.product_variant_package_id.toString());
    formData.append('quantity', payload.quantity.toString());

    const response = await apiClient.post<any>('/cart', formData);

    if (response.isError) {
      let errorMessage = response.message;
      if (response.errors) {
        errorMessage = Object.values(response.errors)[0]?.[0] || response.message;
      }
      throw new Error(errorMessage || 'Failed to add to cart');
    }
    return response.data;
  },

  updateCartItem: async (id: number | string, payload: { quantity: number }) => {
    const response = await apiClient.put<any>(`/cart/${id}`, payload);
    if (response.isError) {
      let errorMessage = response.message;
      if (response.errors) {
        errorMessage = Object.values(response.errors)[0]?.[0] || response.message;
      }
      throw new Error(errorMessage || 'Failed to update cart');
    }
    return response.data?.data || response.data;
  },

  removeCartItem: async (id: number | string) => {
    const response = await apiClient.delete<any>(`/cart/${id}`);
    if (response.isError) throw new Error(response.message || 'Failed to remove from cart');
    return response.data?.data || response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete<any>('/cart-clear');
    if (response.isError) throw new Error(response.message || 'Failed to clear cart');
    return response;
  },
};
