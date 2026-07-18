import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../api-client';

export interface UserRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  roles: UserRole[];
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await ApiClient.get<UserProfile>('/me');

      if (response.isError) {
        throw new Error(response.message);
      }

      return response.data;
    },
    enabled: !!localStorage.getItem("nouh_carting_roken"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await ApiClient.put<any>('/profile', profileData);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      // Map the frontend form data to the expected backend Laravel structure
      const payload = {
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword
      };
      
      const response = await ApiClient.put<any>('/profile', payload);
      
      if (response.isError) {
        // If the backend returns detailed validation errors, you might want to show a specific one
        const errorMessage = response.errors 
          ? Object.values(response.errors)[0]?.[0] || response.message 
          : response.message;
          
        throw new Error(errorMessage as string);
      }
      return response.data;
    }
  });
};
