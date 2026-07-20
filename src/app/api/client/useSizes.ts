import { useQuery } from '@tanstack/react-query';
import { sizesService } from './sizes.service';
import { PaginationParams } from '@/lib/types/api.types';

export const sizeKeys = {
  all: ['sizes'] as const,
  lists: () => [...sizeKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...sizeKeys.lists(), filters] as const,
  details: () => [...sizeKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...sizeKeys.details(), id] as const,
};

export const useSizesQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: sizeKeys.list(params),
    queryFn: () => sizesService.getSizes(params),
  });
};

export const useSizeDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: sizeKeys.detail(id),
    queryFn: () => sizesService.getSizeById(id),
    enabled: !!id,
  });
};
