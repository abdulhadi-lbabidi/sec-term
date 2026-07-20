import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/app/api/client/products.service';
import { ProductFilters } from '@/lib/types/api.types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
};

export const useProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsService.getProducts(filters),
  });
};

export const useProductDetailsQuery = (id: number | string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
  });
};

export const useFeaturedProductsQuery = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productsService.getFeaturedProducts(),
  });
};
