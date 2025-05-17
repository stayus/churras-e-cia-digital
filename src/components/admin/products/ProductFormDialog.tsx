
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
import { Loader2 } from 'lucide-react';
import { useProducts, AddProductData } from '@/hooks/useProducts';

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
  const { addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      setIsSubmitting(true);
      console.log("Produto a ser adicionado:", data);
      
      // Usando a função addProduct do hook useProducts que usa a edge function
      const productData: AddProductData = {
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url || undefined
      };
      
      const result = await addProduct(productData);
      
      if (!result) {
        throw new Error("Não foi possível adicionar o produto");
      }
      
      onSubmit(data);
    } catch (error: any) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível adicionar o produto.',
      });
    } finally {
      setIsSubmitting(false);
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
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
