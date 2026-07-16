import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useProducts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await ApiClient.get<any[]>('/products', { params });
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await ApiClient.get<any>(`/products/${id}`);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    enabled: !!id,
  });
};
