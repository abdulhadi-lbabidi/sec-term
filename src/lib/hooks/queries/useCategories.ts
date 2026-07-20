import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/app/api/client/categories.service';
import { PaginationParams } from '@/lib/types/api.types';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...categoryKeys.details(), id] as const,
};

export const useCategoriesQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesService.getCategories(params),
  });
};

export const useCategoryDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesService.getCategoryById(id),
    enabled: !!id,
  });
};
