import { useMutation } from '@tanstack/react-query';
import { contactService, ContactUsPayload } from './contact.service';

export const useContactUsMutation = () => {
  return useMutation({
    mutationFn: (payload: ContactUsPayload) => contactService.sendContactUsMail(payload),
  });
};
