import { ApiClient as apiClient } from '@/app/api/api-client';
import { Category, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const categoriesService = {
  getCategories: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Category>>('/categories', { params });
    return data;
  },

  getCategoryById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Category }>(`/categories/${id}`);
    return data.data;
  },
};
