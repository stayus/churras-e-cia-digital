
import * as z from 'zod';
import { parse } from 'date-fns';

// Esquema de validação do formulário
export const registerSchema = z.object({
  fullName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  birthDate: z.string().refine((date) => {
    try {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      return !isNaN(parsedDate.getTime());
    } catch (e) {
      return false;
    }
  }, { message: "Data inválida, use o formato DD/MM/YYYY" }),
  street: z.string().min(3, "Endereço deve ter no mínimo 3 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  zip: z.string().min(8, "CEP deve ter no mínimo 8 caracteres"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
