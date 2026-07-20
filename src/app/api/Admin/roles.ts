import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type {
  Role,
  RolesResponse,
  Permission,
  PermissionsResponse,
  RoleDetail,
  RoleDetailResponse,
  CreateRolePayload,
  UpdateRolePayload,
} from '../../../types/Admin/roles';

export type {
  Role,
  RolesResponse,
  Permission,
  PermissionsResponse,
  RoleDetail,
  RoleDetailResponse,
  CreateRolePayload,
  UpdateRolePayload,
};

export const fetchRoles = async (page = 1, perPage = 5): Promise<RolesResponse> => {
  const response = await api.get<RolesResponse>('/roles', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useRolesQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminRoles', page, perPage],
    queryFn: () => fetchRoles(page, perPage),
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
    },
  });
};

export const fetchPermissions = async (page = 1, perPage = 100): Promise<PermissionsResponse> => {
  const response = await api.get<PermissionsResponse>('/permissions', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const usePermissionsQuery = (page = 1, perPage = 100) => {
  return useQuery({
    queryKey: ['adminPermissions', page, perPage],
    queryFn: () => fetchPermissions(page, perPage),
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const response = await api.post('/roles', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
    },
  });
};

export const fetchRole = async (id: number): Promise<RoleDetailResponse> => {
  const response = await api.get<RoleDetailResponse>(`/roles/${id}`);
  return response.data;
};

export const useRoleQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminRole', id],
    queryFn: () => fetchRole(id!),
    enabled: id !== null,
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateRolePayload) => {
      const { id, ...rest } = payload;
      const response = await api.put(`/roles/${id}`, rest);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
      queryClient.invalidateQueries({ queryKey: ['adminRole', variables.id] });
    },
  });
};
