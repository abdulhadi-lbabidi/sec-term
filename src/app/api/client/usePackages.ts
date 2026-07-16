import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await ApiClient.get<any[]>('/packages');
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
  });
};
