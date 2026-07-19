import { ApiClient as apiClient } from '@/app/api/api-client';
import { Size, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const sizesService = {
  getSizes: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Size>>('/sizes', { params });
    return data;
  },

  getSizeById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Size }>(`/sizes/${id}`);
    return data.data;
  },
};
