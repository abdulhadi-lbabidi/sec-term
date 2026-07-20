import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutsService } from './checkouts.service';
import { PaginationParams } from '@/lib/types/api.types';

export const checkoutKeys = {
  all: ['checkouts'] as const,
  lists: () => [...checkoutKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...checkoutKeys.lists(), filters] as const,
  details: () => [...checkoutKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...checkoutKeys.details(), id] as const,
};

export const useCheckoutsQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: checkoutKeys.list(params),
    queryFn: () => checkoutsService.getCheckouts(params),
  });
};

export const useCheckoutDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: checkoutKeys.detail(id),
    queryFn: () => checkoutsService.getCheckoutById(id),
    enabled: !!id,
  });
};

export const useCreateCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutsService.createCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutKeys.all });
    },
  });
};
