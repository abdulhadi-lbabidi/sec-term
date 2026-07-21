import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { Category, CategoriesResponse } from '../../../types/Admin/categories';
export type { Category, CategoriesResponse };


export const fetchCategories = async (page = 1, perPage = 5, search?: string): Promise<CategoriesResponse> => {
  const params: Record<string, any> = {
    paginate: 1,
    per_page: perPage,
    page: page,
  };
  if (search && search.trim()) {
    params['filter[search]'] = search.trim();
  }
  const response = await api.get<CategoriesResponse>('/categories', { params });
  return response.data;
};

export const useCategoriesQuery = (page = 1, perPage = 5, search?: string) => {
  return useQuery({
    queryKey: ['adminCategories', page, perPage, search],
    queryFn: () => fetchCategories(page, perPage, search),
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
};

export const fetchCategory = async (id: number): Promise<{ data: Category }> => {
  const response = await api.get<{ data: Category }>(`/categories/${id}?all_languages=true`);
  return response.data;
};

export const useCategoryQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminCategory', id],
    queryFn: () => fetchCategory(id!),
    enabled: id !== null,
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await api.post(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['adminCategory'] });
    },
  });
};
