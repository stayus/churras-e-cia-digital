
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProducts, Product } from '@/hooks/useProducts';
import ProductForm from './ProductForm';
import { ProductFormValues } from './schema/productSchema';

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Product) => void;
  product: Product | null;
}

const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  product
}) => {
  const { toast } = useToast();
  const { updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!product) return null;
  
  const defaultValues: ProductFormValues = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category as 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro',
    image_url: product.image_url || '',
  };
  
  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Produto a ser atualizado:", product.id, data);
      
      const result = await updateProduct(product.id, {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url || ''
      });
      
      if (!result) {
        throw new Error("Não foi possível atualizar o produto");
      }
      
      onSubmit(result);
      onOpenChange(false);
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso."
      });
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar o produto.',
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
            Editar produto
          </DialogTitle>
        </DialogHeader>
        
        <ProductForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultValues={defaultValues}
          isEditing={true}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
