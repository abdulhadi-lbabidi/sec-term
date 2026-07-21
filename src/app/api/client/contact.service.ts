import { ApiClient as apiClient } from '@/app/api/api-client';

export interface ContactUsPayload {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  sendContactUsMail: async (payload: ContactUsPayload) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    formData.append('message', payload.message);

    const response = await apiClient.post('/contact-us', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
