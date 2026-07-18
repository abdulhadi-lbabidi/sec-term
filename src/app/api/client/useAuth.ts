import { useMutation } from '@tanstack/react-query';
import { ApiClient } from '../api-client';
import { useAppStore } from '../../store/useAppStore';

export const useAuth = () => {
  const loginUser = useAppStore(state => state.loginUser);
  const logoutUser = useAppStore(state => state.logoutUser);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password?: string }) => {
      const response = await ApiClient.post<any>('/login', credentials);
      if (response.isError) throw new Error(response.message);
      return response;
    },
    onSuccess: (data: any, variables) => {
      const token = data?.token || data?.data?.token;
      console.log("token", token, data);

      if (token) localStorage.setItem('nouh_carting_roken', token);

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
      if (token) localStorage.setItem('token', token);

      const role = data?.role || data?.data?.role || 'customer';
      const email = data?.email || data?.data?.email || '';
      loginUser(email, role);
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => {
      // Mock API call since endpoint is not ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: "OTP sent" };
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (data.otp !== '123456') throw new Error("Invalid OTP code. Try 123456");
      return { success: true };
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotLoading: forgotPasswordMutation.isPending,
    verifyOTP: verifyOtpMutation.mutateAsync,
    isVerifyLoading: verifyOtpMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetLoading: resetPasswordMutation.isPending,
    logout: () => {
      localStorage.removeItem('token');
      logoutUser();
    }
  };
};
