
import * as z from 'zod';

// Product form schema with validation
export const productSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  price: z.number().positive({ message: 'Preço deve ser maior que zero' }),
  image_url: z.string().url({ message: 'URL de imagem inválida' }).or(z.string().length(0)),
});

export type ProductFormValues = z.infer<typeof productSchema>;
