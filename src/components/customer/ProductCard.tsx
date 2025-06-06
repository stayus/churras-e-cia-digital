
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart';
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
    case 'lanche': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'bebida': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'refeicao': return 'bg-green-100 text-green-800 border border-green-200';
    case 'sobremesa': return 'bg-purple-100 text-purple-800 border border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200';
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
  
  const truncateDescription = (text: string, maxLength: number = 100) => {
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
    
    if (onCartOpen) {
      setTimeout(() => {
        onCartOpen();
      }, 500);
    }
  };
  
  return (
    <Card className="bg-white border border-gray-200 overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img 
          src={image_url || 'https://placehold.co/400x250?text=Produto'} 
          alt={name}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={`absolute top-3 right-3 ${categoryClass} font-medium`}>
          {categoryLabel}
        </Badge>
        {promotion_price && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Promoção
          </div>
        )}
        {is_out_of_stock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white text-center">
              <p className="text-xl font-bold mb-2">Esgotado</p>
              <p className="text-sm opacity-75">Produto indisponível</p>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {truncateDescription(description)}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t border-gray-100 p-6">
        <div className="flex flex-col">
          {promotion_price ? (
            <>
              <span className="text-red-600 font-bold text-lg">{formatCurrency(promotion_price)}</span>
              <span className="text-gray-500 text-sm line-through">{formatCurrency(price)}</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold text-lg">{formatCurrency(price)}</span>
          )}
        </div>
        <Button 
          size="sm" 
          disabled={is_out_of_stock}
          className={`${
            is_out_of_stock 
              ? 'opacity-50 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          } flex items-center gap-2`}
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
