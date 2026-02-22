import { z } from "zod";

export const createEmailSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
	storage: z.number().min(1, "O armazenamento deve ser maior que 0"),
});

export type CreateEmailFormData = z.infer<typeof createEmailSchema>;

export const changePasswordSchema = z.object({
	password: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
