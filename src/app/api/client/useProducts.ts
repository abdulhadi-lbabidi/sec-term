import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from './products.service';
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

export const useReviewsQuery = (params: any) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => productsService.getReviews(params),
    enabled: !!params['filter[product_variant_id]'],
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

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review: { rating: number, comment?: string, product_variant_id: string | number, product_id: string | number }) => productsService.addReview(review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.product_id) });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};
