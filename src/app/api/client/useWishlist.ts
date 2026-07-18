import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await ApiClient.get<any>('/wishlist');
      if (response.isError) throw new Error(response.message);
      return response.data?.data || response.data || [];
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { product_variant_id: number }) => {
      // API might expect product_id or product_variant_id.
      // Modify this payload according to backend requirements.
      const response = await ApiClient.post<any>('/wishlist', data);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await ApiClient.delete<any>(`/wishlist/${id}`);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};
