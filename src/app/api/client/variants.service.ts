import { ApiClient as apiClient } from '@/app/api/api-client';
import { ProductVariant, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const variantsService = {
  getVariants: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<ProductVariant>>('/product-variants', { params });
    return data;
  },

  getVariantById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: ProductVariant }>(`/product-variants/${id}`);
    return data.data;
  },
};
