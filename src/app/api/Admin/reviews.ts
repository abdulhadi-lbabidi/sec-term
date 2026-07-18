import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { Review, ReviewsResponse } from '../../../types/Admin/reviews';
export type { Review, ReviewsResponse };

export const fetchReviews = async (page = 1, perPage = 10): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>('/reviews', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useReviewsQuery = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['adminReviews', page, perPage],
    queryFn: () => fetchReviews(page, perPage),
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
  });
};
