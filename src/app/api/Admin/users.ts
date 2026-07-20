import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type {
  UsersResponse,
  UserItem,
  UserCreatePayload,
  UserUpdatePayload,
} from '../../../types/Admin/users';

export type { UsersResponse, UserItem, UserCreatePayload, UserUpdatePayload };

export const fetchUsers = async (page = 1, perPage = 5): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>('/users', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useUsersQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminUsers', page, perPage],
    queryFn: () => fetchUsers(page, perPage),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserCreatePayload) => {
      const response = await api.post('/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UserUpdatePayload }) => {
      const response = await api.patch(`/users/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};
