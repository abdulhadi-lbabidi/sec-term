import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { CheckoutsResponse } from '../../../types/Admin/checkouts';

export const fetchCheckouts = async (page = 1, perPage = 5): Promise<CheckoutsResponse> => {
  const response = await api.get<CheckoutsResponse>('/checkouts', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useCheckoutsQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminCheckouts', page, perPage],
    queryFn: () => fetchCheckouts(page, perPage),
  });
};

export const useDeleteCheckoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/checkouts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCheckouts'] });
    },
  });
};
