import { useQuery } from '@tanstack/react-query';
import { emailService } from '../services/emailService';

export const useEmails = (domainId: string | undefined) => {
  return useQuery({
    queryKey: ['emails', domainId], 
    queryFn: () => emailService.getEmailsByDomain(domainId!),
    enabled: !!domainId,
  });
};