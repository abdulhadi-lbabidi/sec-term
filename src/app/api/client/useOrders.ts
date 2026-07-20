import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from './orders.service';
import { PaginationParams } from '@/lib/types/api.types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...orderKeys.details(), id] as const,
};

export const useOrdersQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersService.getOrders(params),
  });
};

export const useOrderDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
