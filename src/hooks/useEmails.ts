import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export interface EmailAccount {
  id: string;
  domainId: string;
  email: string;
  storage: number;
  isBlocked: boolean;
}

export const useEmails = (domainId: string | undefined) => {
  return useQuery<EmailAccount[]>({
    queryKey: ["emails", domainId],
    queryFn: async () => {
      const response = await api.get(`/domains/${domainId}/emails`);
      return response.data;
    },
    enabled: !!domainId,
  });
};