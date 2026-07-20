import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { OrdersResponse } from '../../../types/Admin/orders';

export const fetchOrders = async (page = 1, perPage = 5): Promise<OrdersResponse> => {
  const response = await api.get<OrdersResponse>('/orders', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useOrdersQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminOrders', page, perPage],
    queryFn: () => fetchOrders(page, perPage),
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.patch(`/orders/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};
