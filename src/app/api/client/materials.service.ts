import { ApiClient as apiClient } from '@/app/api/api-client';
import { Material, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const materialsService = {
  getMaterials: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Material>>('/materials', { params });
    return data;
  },

  getMaterialById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Material }>(`/materials/${id}`);
    return data.data;
  },
};
