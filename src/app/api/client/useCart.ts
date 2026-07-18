import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useCartItems = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await ApiClient.get<any>('/cart');
      if (response.isError) throw new Error(response.message);
      return response.data?.cart_items || response.data || [];
    },
    // Only fetch if token exists
    enabled: !!localStorage.getItem("token"),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { variant_id: number; quantity: number; notes?: string }) => {
      const response = await ApiClient.post<any>('/cart', data);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; quantity: number }) => {
      const response = await ApiClient.put<any>(`/cart/${data.id}`, { quantity: data.quantity });
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await ApiClient.delete<any>(`/cart/${id}`);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await ApiClient.delete<any>('/cart-clear');
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};
