import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import { Category, CategoriesResponse } from '../../../types/Admin/categories';
export type { Category, CategoriesResponse };


export const fetchCategories = async (page = 1, perPage = 5): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>('/categories', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useCategoriesQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminCategories', page, perPage],
    queryFn: () => fetchCategories(page, perPage),
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
