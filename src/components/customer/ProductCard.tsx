
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { useCart, CartExtra } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});

  const hasPromotion = !!product.promotion_price;
  const displayPrice = hasPromotion ? product.promotion_price! : product.price;
  
  const handleAddToCart = () => {
    // Filtrar extras selecionados
    const extras = product.extras ? product.extras.filter(extra => selectedExtras[extra.id]) : [];
    
    // Adicionar ao carrinho com o formato esperado pelo CartContext
    addItem(product, extras as CartExtra[]);
    
    // Fechar diálogo e resetar estado
    setDialogOpen(false);
    setQuantity(1);
    setSelectedExtras({});
  };

  // Calcular preço total com extras
  const calculateTotalPrice = () => {
    let total = displayPrice * quantity;
    
    if (product.extras) {
      product.extras.forEach(extra => {
        if (selectedExtras[extra.id]) {
          total += extra.price * quantity;
        }
      });
    }
    
    return total;
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => ({
      ...prev,
      [extraId]: !prev[extraId]
    }));
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {hasPromotion && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Oferta
            </Badge>
          )}
          
          {product.is_out_of_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-3 py-1.5">
                Indisponível
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
          
          <div className="flex items-baseline">
            {hasPromotion && (
              <span className="text-gray-400 text-sm line-through mr-2">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className={`text-lg font-bold ${hasPromotion ? 'text-red-600' : ''}`}>
              {formatCurrency(displayPrice)}
            </span>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full"
            disabled={product.is_out_of_stock}
            onClick={() => setDialogOpen(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>
              {product.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Preço:</span>
              <span className="font-semibold">
                {hasPromotion && (
                  <span className="text-gray-400 text-sm line-through mr-2">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <span className={hasPromotion ? 'text-red-600' : ''}>
                  {formatCurrency(displayPrice)}
                </span>
              </span>
            </div>
            
            {/* Quantidade */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantidade:</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Extras */}
            {product.extras && product.extras.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Adicionais:</h4>
                  {product.extras.map(extra => (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`extra-${extra.id}`}
                          checked={!!selectedExtras[extra.id]}
                          onChange={() => toggleExtra(extra.id)}
                          className="rounded"
                        />
                        <label htmlFor={`extra-${extra.id}`} className="text-sm">
                          {extra.name}
                        </label>
                      </div>
                      <span className="text-sm">
                        + {formatCurrency(extra.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotalPrice())}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddToCart}>
              Adicionar ao carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
