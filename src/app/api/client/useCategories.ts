import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await ApiClient.get<any[]>('/categories');
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
  });
};
