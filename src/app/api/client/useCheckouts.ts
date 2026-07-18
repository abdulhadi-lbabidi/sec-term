import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export const useCheckouts = () => {
  return useQuery({
    queryKey: ['checkouts'],
    queryFn: async () => {
      const response = await ApiClient.get<any>('/checkouts');
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: async (checkoutData: any) => {
      const response = await ApiClient.post<any>('/checkouts', checkoutData);
      if (response.isError) throw new Error(response.message);
      return response.data;
    }
  });
};
