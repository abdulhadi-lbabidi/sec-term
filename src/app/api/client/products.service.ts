import { ApiClient as apiClient } from '@/app/api/api-client';
import { ProductFilters } from '@/lib/types/api.types';
import { Product } from '@/types/Client/product';

export const productsService = {
  getProducts: async (params?: ProductFilters) => {
    const response = await apiClient.get<Product[]>('/products', { params });
    return {
      data: response.data || [],
      meta: response.meta
    };
  },

  getProductById: async (id: number | string) => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  getFeaturedProducts: async () => {
    const { data } = await apiClient.get<Product[]>('/products/featured');
    return data || [];
  },

  addReview: async (reviewData: { rating: number; comment?: string; product_id: number | string; product_variant_id: number | string }) => {
    const { data } = await apiClient.post<any>(`/reviews`, reviewData);
    return data;
  },

  getReviews: async (params: any) => {
    const response = await apiClient.get<any>('/reviews', { params });
    return {
      data: response.data || [],
      meta: response.meta
    };
  }
};
