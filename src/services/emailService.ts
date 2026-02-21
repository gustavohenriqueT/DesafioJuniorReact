import { api } from "../api/axios";
import type { CreateEmailFormData } from "../schemas/email";

export interface EmailAccount {
	id: string;
	domainId?: string;
	email: string;
	storage: number;
	isBlocked: boolean;
}

export const emailService = {
	getEmailsByDomain: async (domainId: string): Promise<EmailAccount[]> => {
		const response = await api.get<EmailAccount[]>(
			`/domains/${domainId}/emails`,
		);
		return response.data;
	},

	createEmail: async (
		domainId: string,
		data: CreateEmailFormData,
	): Promise<EmailAccount> => {
		const response = await api.post<EmailAccount>(
			`/domains/${domainId}/emails`,
			data,
		);
		return response.data;
	},

	deleteEmail: async (domainId: string, emailId: string): Promise<void> => {
		await api.delete(`/domains/${domainId}/emails/${emailId}`);
	},

	toggleBlockStatus: async (
		domainId: string,
		emailId: string,
	): Promise<void> => {
		await api.patch(`/domains/${domainId}/emails/${emailId}`);
	},

	updateStorage: async (
		domainId: string,
		emailId: string,
		storage: number,
	): Promise<void> => {
		await api.put(`/domains/${domainId}/emails/${emailId}`, { storage });
	},

	updatePassword: async (
		domainId: string,
		emailId: string,
		data: ChangePasswordFormData,
	): Promise<void> => {
		await api.patch(`/domains/${domainId}/emails/${emailId}/password`, data);
	},
};
