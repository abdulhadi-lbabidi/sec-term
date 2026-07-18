import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useProducts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await ApiClient.get<any>('/products', { params });
      if (response.isError) throw new Error(response.message);
      
      const data = response.data;
      
      let products = [];
      let sourceData: any = data;
      
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.data)) {
        products = data.data;
        sourceData = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
        sourceData = data.products;
      } else {
        const resAny = response as any;
        if (resAny && Array.isArray(resAny.products)) {
          products = resAny.products;
          sourceData = resAny.products;
        } else if (resAny && Array.isArray(resAny.data)) {
          products = resAny.data;
          sourceData = resAny;
        }
      }

      let meta = response.meta || (data && data.meta) || null;
      
      // Try to find pagination meta directly if not in 'meta' key
      if (!meta) {
        const potentialSources = [response as any, data, sourceData];
        for (const src of potentialSources) {
          if (src && src.last_page !== undefined) {
            meta = {
              current_page: src.current_page || 1,
              last_page: src.last_page || 1,
              per_page: src.per_page || 15,
              total: src.total || 0,
            };
            break;
          }
        }
      }
      
      return { products, meta };
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await ApiClient.get<any>(`/products/${id}`);
      if (response.isError) throw new Error(response.message);
      
      const data = response.data;
      if (data && data.data) return data.data;
      if (data && data.product) return data.product;
      
      return data;
    },
    enabled: !!id,
  });
};
