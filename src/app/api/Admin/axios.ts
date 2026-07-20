import axios from 'axios';
import i18n from '../../i18n/config';

import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const lang = i18n.language || 'ar';
  config.headers['Accept-Language'] = lang;

  const token = localStorage.getItem('nouh_carting_roken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('nouh_carting_roken');
        localStorage.removeItem('nouh_carting_user_id');
        window.location.href = '/admin/login';
      } else if (status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                toast.error(msg);
              });
            } else if (typeof messages === 'string') {
              toast.error(messages);
            }
          });
        } else {
          toast.error(error.response.data?.message || (i18n.language === 'ar' ? 'بيانات غير صالحة' : 'Invalid data'));
        }
      } else if (status === 500) {
        toast.error(i18n.language === 'ar' ? 'حدث خطأ في الخادم (500)' : 'Internal server error (500)');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
