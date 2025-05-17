
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { productSchema, ProductFormValues } from './schema/productSchema';

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: Partial<ProductFormValues>;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  isEditing = false,
}) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      price: 0,
      image_url: '',
    },
  });

  const handleSubmit = async (data: ProductFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do produto*</Label>
        <Input
          id="name"
          placeholder="Ex: X-Burger Especial"
          disabled={isSubmitting}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição*</Label>
        <Textarea
          id="description"
          placeholder="Descreva os ingredientes e detalhes do produto"
          disabled={isSubmitting}
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)*</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          disabled={isSubmitting}
          {...form.register('price', { valueAsNumber: true })}
        />
        {form.formState.errors.price && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.price.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image_url">URL da imagem</Label>
        <Input
          id="image_url"
          placeholder="https://exemplo.com/imagem.jpg"
          disabled={isSubmitting}
          {...form.register('image_url')}
        />
        {form.formState.errors.image_url && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.image_url.message}</p>
        )}
      </div>
      
      <div className="mt-6 flex justify-end gap-2">
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Atualizando...' : 'Adicionando...'}
            </>
          ) : (
            isEditing ? 'Atualizar' : 'Adicionar'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
