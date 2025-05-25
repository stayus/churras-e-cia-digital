
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (product.is_out_of_stock) {
      toast({
        title: "Produto esgotado",
        description: "Este produto está temporariamente esgotado.",
        variant: "destructive"
      });
      return;
    }

    // Convert Product to match cart's expected format
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.promotion_price || product.price,
      image_url: product.image_url,
      category: product.category,
      is_out_of_stock: product.is_out_of_stock,
      promotion_price: product.promotion_price,
      extras: product.extras || []
    };

    addItem(cartProduct, []);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const currentPrice = product.promotion_price || product.price;
  const hasPromotion = product.promotion_price && product.promotion_price < product.price;

  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 rounded-2xl">
      <div className="relative overflow-hidden">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop"} 
          alt={product.name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {hasPromotion && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-lg animate-pulse">
            PROMOÇÃO
          </Badge>
        )}
        
        {product.is_out_of_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">ESGOTADO</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {formatCurrency(currentPrice)}
            </span>
            {hasPromotion && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                De {formatCurrency(product.price)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          disabled={product.is_out_of_stock}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.is_out_of_stock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
