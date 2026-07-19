import axios from 'axios';
import i18n from '../../i18n/config';

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
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('nouh_carting_roken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
