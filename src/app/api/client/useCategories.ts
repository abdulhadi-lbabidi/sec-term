import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await ApiClient.get<any>('/categories');
      if (response.isError) throw new Error(response.message);

      const data = response.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      if (data && Array.isArray(data.categories)) return data.categories;

      const resAny = response as any;
      if (resAny && Array.isArray(resAny.categories)) return resAny.categories;
      if (resAny && Array.isArray(resAny.data)) return resAny.data;

      return [];
    },

  });
};
