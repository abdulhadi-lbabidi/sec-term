import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export interface Material {
  id: number;
  material: string;
  created_at: string;
}

export interface MaterialsResponse {
  data: Material[];
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
    mutationFn: async ({ materialAr, materialEn }: { materialAr: string; materialEn: string }) => {
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
    mutationFn: async ({ id, materialAr, materialEn }: { id: number; materialAr: string; materialEn: string }) => {
      const payload = {
        'material[ar]': materialAr,
        'material[en]': materialEn,
      };
      const response = await api.patch(`/materials/${id}`, payload);
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

export const fetchMaterial = async (id: number): Promise<any> => {
  const response = await api.get(`/materials/${id}?all_languages=true`);
  return response.data;
};

export const useMaterialQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['adminMaterial', id],
    queryFn: () => fetchMaterial(id!),
    enabled: id !== null,
  });
};
