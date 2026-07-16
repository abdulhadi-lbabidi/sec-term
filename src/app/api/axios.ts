import axios from 'axios';
import i18n from '../i18n/config';

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>;
  }
}

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

  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export default api;
