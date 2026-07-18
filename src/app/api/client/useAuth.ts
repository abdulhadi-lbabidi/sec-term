import { useMutation } from '@tanstack/react-query';
import { ApiClient } from '../api-client';
import { useAppStore } from '../../store/useAppStore';

export const useAuth = () => {
  const loginUser = useAppStore(state => state.loginUser);
  const logoutUser = useAppStore(state => state.logoutUser);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password?: string }) => {
      const response = await ApiClient.post<any>('/auth/login', credentials);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Mock role determination based on email for testing, replace with actual token role parsing
      const role = variables.email.includes('admin') ? 'admin' : 'customer';
      loginUser(variables.email, role);
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutUser
  };
};
