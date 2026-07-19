import { useQuery } from '@tanstack/react-query';
import { materialsService } from './materials.service';
import { PaginationParams } from '@/lib/types/api.types';

export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...materialKeys.details(), id] as const,
};

export const useMaterialsQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: () => materialsService.getMaterials(params),
  });
};

export const useMaterialDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => materialsService.getMaterialById(id),
    enabled: !!id,
  });
};
