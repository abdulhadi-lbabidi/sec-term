import { useMutation } from '@tanstack/react-query';
import { ApiClient } from '../api-client';
import { useAppStore } from '../../store/useAppStore';

export const useAuth = () => {
  const loginUser = useAppStore(state => state.loginUser);
  const logoutUser = useAppStore(state => state.logoutUser);

  const loginWithGoogle = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    window.location.href = `${baseUrl}/login-google`;
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password?: string }) => {
      const response = await ApiClient.post<any>('/login', credentials);
      if (response.isError) throw new Error(response.message);

      const data = response.data || response;
      const role = data?.role || data?.data?.role || (credentials.email.includes('admin') ? 'admin' : 'customer');

      if (role !== 'customer') {
        throw new Error("لا تملك الصلاحية للدخول كعميل. يرجى استخدام لوحة التحكم.");
      }

      return response;
    },
    onSuccess: (data: any, variables) => {
      const token = data?.token || data?.data?.token;

      if (token) localStorage.setItem('nouh_client_token', token);

      const role = data?.role || data?.data?.role || (variables.email.includes('admin') ? 'admin' : 'customer');
      loginUser(variables.email, role);
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await ApiClient.post<any>('/register', userData);
      if (response.isError) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (data) => {
      const token = data?.token || data?.data?.token;
      if (token) localStorage.setItem('nouh_client_token', token);

      const role = data?.role || data?.data?.role || 'customer';
      const email = data?.email || data?.data?.email || '';
      loginUser(email, role);
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await ApiClient.post<any>('/forgot-password', data);
      if (response.isError) throw new Error(response.message || "Failed to send OTP");
      return response.data || response;
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; token: string; password: string; password_confirmation: string }) => {
      const response = await ApiClient.post<any>('/reset-password', data);
      if (response.isError) throw new Error(response.message || "Failed to reset password");
      return response.data || response;
    }
  });

  return {
    loginWithGoogle,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotLoading: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetLoading: resetPasswordMutation.isPending,
    logout: () => {
      localStorage.removeItem('nouh_client_token');
      logoutUser();
    }
  };
};
