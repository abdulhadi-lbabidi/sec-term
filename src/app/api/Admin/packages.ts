import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { PackageItem, PackagesResponse } from '../../../types/Admin/packages';

export const fetchPackages = async (page = 1, perPage = 5): Promise<PackagesResponse> => {
  const response = await api.get<PackagesResponse>('/packages', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const usePackagesQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminPackages', page, perPage],
    queryFn: () => fetchPackages(page, perPage),
  });
};

export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/packages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
    },
  });
};

export const useUpdatePackageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await api.post(`/packages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
    },
  });
};

export const useDeletePackageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
    },
  });
};

export const fetchPackage = async (id: number): Promise<{ data: PackageItem }> => {
  const response = await api.get<{ data: PackageItem }>(`/packages/${id}?all_languages=true`);
  return response.data;
};

export const usePackageQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminPackage', id],
    queryFn: () => fetchPackage(id!),
    enabled: id !== null,
  });
};
