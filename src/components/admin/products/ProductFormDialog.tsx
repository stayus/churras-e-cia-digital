
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { AddProductData } from '@/types/product';
import ProductForm from './ProductForm';
import { ProductFormValues } from './schema/productSchema';

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
  
  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Produto a ser adicionado:", data);
      
      // Usando a função addProduct do hook useProducts que usa a edge function
      const productData: AddProductData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url || undefined
      };
      
      const result = await addProduct(productData);
      
      if (!result) {
        throw new Error("Não foi possível adicionar o produto");
      }
      
      onSubmit(data);
      onOpenChange(false);
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
        
        <ProductForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultValues={defaultValues}
          isEditing={isEditing}
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

export default ProductFormDialog;
