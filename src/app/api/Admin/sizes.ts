import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export interface Size {
  id: number;
  size: string;
  created_at: string;
}

export interface SizesResponse {
  data: Size[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export const fetchSizes = async (page = 1, perPage = 5): Promise<SizesResponse> => {
  const response = await api.get<SizesResponse>('/sizes', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useSizesQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminSizes', page, perPage],
    queryFn: () => fetchSizes(page, perPage),
  });
};

export const useCreateSizeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (size: string) => {
      const formData = new FormData();
      formData.append('size', size);
      const response = await api.post('/sizes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSizes'] });
    },
  });
};

export const useUpdateSizeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, size }: { id: number; size: string }) => {
      const response = await api.patch(`/sizes/${id}`, { size });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSizes'] });
    },
  });
};

export const useDeleteSizeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/sizes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSizes'] });
    },
  });
};
