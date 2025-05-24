
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onCartOpen?: () => void;
}

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'lanche': return 'Lanche';
    case 'bebida': return 'Bebida';
    case 'refeicao': return 'Refeição';
    case 'sobremesa': return 'Sobremesa';
    default: return 'Outro';
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'lanche': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'bebida': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'refeicao': return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'sobremesa': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onCartOpen }) => {
  const { name, description, price, image_url, promotion_price, is_out_of_stock, category } = product;
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const categoryClass = getCategoryColor(category);
  const categoryLabel = getCategoryLabel(category);
  
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const handleAddToCart = () => {
    addItem(product, []);
    toast({
      title: "Produto adicionado",
      description: `${name} foi adicionado ao carrinho.`
    });
    
    // Auto-open cart sidebar after adding item
    if (onCartOpen) {
      setTimeout(() => {
        onCartOpen();
      }, 500);
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={image_url || 'https://placehold.co/300x200?text=Produto'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${categoryClass}`}>
          {categoryLabel}
        </Badge>
        {promotion_price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            Promoção
          </div>
        )}
        {is_out_of_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <p className="text-white text-xl font-bold">Esgotado</p>
          </div>
        )}
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{truncateDescription(description)}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t p-4">
        <div>
          {promotion_price ? (
            <div className="flex flex-col">
              <span className="text-red-600 font-bold">{formatCurrency(promotion_price)}</span>
              <span className="text-gray-500 text-sm line-through">{formatCurrency(price)}</span>
            </div>
          ) : (
            <span className="font-bold">{formatCurrency(price)}</span>
          )}
        </div>
        <Button 
          size="sm" 
          disabled={is_out_of_stock}
          className="flex items-center gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
