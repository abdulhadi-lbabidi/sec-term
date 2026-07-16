import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ApiClient.get<any[]>('/orders');
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await ApiClient.post<any>('/orders', orderData);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
