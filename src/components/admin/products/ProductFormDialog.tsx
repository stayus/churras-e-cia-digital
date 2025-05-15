
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Product form schema with validation
const productSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  price: z.number().positive({ message: 'Preço deve ser maior que zero' }),
  image_url: z.string().url({ message: 'URL de imagem inválida' }).or(z.string().length(0)),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormValues) => void;
  defaultValues?: Partial<ProductFormValues>;
  isEditing?: boolean;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}) => {
  const { toast } = useToast();
  
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
    try {
      // Save to Supabase
      const { error } = await supabase.from('products').insert([{
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url || 'https://placehold.co/300x200?text=Produto',
      }]);

      if (error) throw error;

      toast({
        title: 'Produto adicionado',
        description: 'O produto foi adicionado com sucesso.',
      });
      onSubmit(data);
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível adicionar o produto.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar produto' : 'Adicionar novo produto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do produto*</Label>
            <Input
              id="name"
              placeholder="Ex: X-Burger Especial"
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
              {...form.register('image_url')}
            />
            {form.formState.errors.image_url && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.image_url.message}</p>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
