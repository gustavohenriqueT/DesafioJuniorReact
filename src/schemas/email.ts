import { z } from 'zod';

export const createEmailSchema = z.object({
  email: z.string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  storage: z.coerce.number({ invalid_type_error: 'Digite um número válido' })
    .positive('O armazenamento deve ser maior que 0 MB'),
});

export type CreateEmailFormData = z.infer<typeof createEmailSchema>;

export const changePasswordSchema = z.object({
  password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
