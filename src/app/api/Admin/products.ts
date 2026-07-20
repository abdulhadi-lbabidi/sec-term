import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { Product, ProductsResponse, ProductVariant, ProductVariantResponse } from '../../../types/Admin/products';

export const fetchProducts = async (page = 1, perPage = 5): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/products', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useProductsQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminProducts', page, perPage],
    queryFn: () => fetchProducts(page, perPage),
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const fetchProduct = async (id: number): Promise<{ data: Product }> => {
  const response = await api.get<{ data: Product }>(`/products/${id}?all_languages=true`);
  return response.data;
};

export const useProductQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminProduct', id],
    queryFn: () => fetchProduct(id!),
    enabled: id !== null,
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await api.post(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminProduct'] });
    },
  });
};

export const useCreateProductVariantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/product-variants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const useDeleteProductVariantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/product-variants/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const fetchProductVariant = async (id: number): Promise<ProductVariantResponse> => {
  const response = await api.get<ProductVariantResponse>(`/product-variants/${id}`);
  return response.data;
};

export const useProductVariantQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminProductVariant', id],
    queryFn: () => fetchProductVariant(id!),
    enabled: id !== null,
  });
};

export const useUpdateProductVariantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/product-variants/bulk-update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminProductVariant'] });
    },
  });
};
