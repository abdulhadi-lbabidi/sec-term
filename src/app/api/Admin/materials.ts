import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type {
  Material,
  MaterialsResponse,
  MaterialDetailResponse,
  CreateMaterialPayload,
  UpdateMaterialPayload,
} from '../../../types/Admin/materials';

export type {
  Material,
  MaterialsResponse,
  MaterialDetailResponse,
  CreateMaterialPayload,
  UpdateMaterialPayload,
};

export const fetchMaterials = async (page = 1, perPage = 5): Promise<MaterialsResponse> => {
  const response = await api.get<MaterialsResponse>('/materials', {
    params: {
      paginate: 1,
      per_page: perPage,
      page: page,
    },
  });
  return response.data;
};

export const useMaterialsQuery = (page = 1, perPage = 5) => {
  return useQuery({
    queryKey: ['adminMaterials', page, perPage],
    queryFn: () => fetchMaterials(page, perPage),
  });
};

export const useCreateMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ materialAr, materialEn }: CreateMaterialPayload) => {
      const formData = new FormData();
      formData.append('material[ar]', materialAr);
      formData.append('material[en]', materialEn);
      const response = await api.post('/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMaterials'] });
    },
  });
};

export const useUpdateMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: UpdateMaterialPayload) => {
      const response = await api.post(`/materials/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMaterials'] });
    },
  });
};

export const useDeleteMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/materials/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMaterials'] });
    },
  });
};

export const fetchMaterial = async (id: number): Promise<MaterialDetailResponse> => {
  const response = await api.get<MaterialDetailResponse>(`/materials/${id}?all_languages=true`);
  return response.data;
};

export const useMaterialQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminMaterial', id],
    queryFn: () => fetchMaterial(id!),
    enabled: id !== null,
  });
};
