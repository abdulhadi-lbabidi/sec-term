import { ApiClient as apiClient } from '@/app/api/api-client';
import { Package, PaginationParams, PaginatedResponse } from '@/lib/types/api.types';

export const packagesService = {
  getPackages: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Package>>('/packages', { params });
    return data;
  },

  getPackageById: async (id: number | string) => {
    const { data } = await apiClient.get<{ data: Package }>(`/packages/${id}`);
    return data.data;
  },
};
