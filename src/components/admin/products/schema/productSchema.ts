
import * as z from 'zod';

// Product form schema with validation
export const productSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  price: z.number().positive({ message: 'Preço deve ser maior que zero' }),
  image_url: z.string().url({ message: 'URL de imagem inválida' }).or(z.string().length(0)),
  category: z.enum(['lanche', 'bebida', 'refeicao', 'sobremesa', 'outro'], {
    required_error: 'Selecione uma categoria',
  }),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// Available categories for product selection
export const productCategories = [
  { value: 'lanche', label: 'Lanche' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'refeicao', label: 'Refeição' },
  { value: 'sobremesa', label: 'Sobremesa' },
  { value: 'outro', label: 'Outro' }
];
