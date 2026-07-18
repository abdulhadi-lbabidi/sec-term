import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useSizes = () => {
  return useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      try {
        const response = await ApiClient.get<any>('/sizes');
        if (response.isError) throw new Error(response.message);
        
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.sizes)) return data.sizes;
        return [];
      } catch (err) {
        // Fallback or empty if not implemented
        return [];
      }
    },
    retry: 1,
  });
};
