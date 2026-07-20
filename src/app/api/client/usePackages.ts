import { useQuery } from '@tanstack/react-query';
import { packagesService } from './packages.service';
import { PaginationParams } from '@/lib/types/api.types';

export const packageKeys = {
  all: ['packages'] as const,
  lists: () => [...packageKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...packageKeys.lists(), filters] as const,
  details: () => [...packageKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...packageKeys.details(), id] as const,
};

export const usePackagesQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: packageKeys.list(params),
    queryFn: () => packagesService.getPackages(params),
  });
};

export const usePackageDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: packageKeys.detail(id),
    queryFn: () => packagesService.getPackageById(id),
    enabled: !!id,
  });
};
