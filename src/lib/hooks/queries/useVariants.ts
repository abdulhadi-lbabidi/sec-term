import { useQuery } from '@tanstack/react-query';
import { variantsService } from '@/app/api/client/variants.service';
import { PaginationParams } from '@/lib/types/api.types';

export const variantKeys = {
  all: ['variants'] as const,
  lists: () => [...variantKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...variantKeys.lists(), filters] as const,
  details: () => [...variantKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...variantKeys.details(), id] as const,
};

export const useVariantsQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: variantKeys.list(params),
    queryFn: () => variantsService.getVariants(params),
  });
};

export const useVariantDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: variantKeys.detail(id),
    queryFn: () => variantsService.getVariantById(id),
    enabled: !!id,
  });
};
