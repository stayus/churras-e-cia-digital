import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/format';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCartOpen: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCartOpen }) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(product);
    setIsAdding(false);
    onCartOpen();
  };

  const handleRemoveFromCart = async () => {
    setIsRemoving(true);
    await removeItem(product.id);
    setIsRemoving(false);
  };

  const handleIncreaseQuantity = async () => {
    setIsAdding(true);
    await addItem(product);
    setIsAdding(false);
  };

  const handleDecreaseQuantity = async () => {
    setIsRemoving(true);
    await removeItem(product.id, true);
    setIsRemoving(false);
  };

  return (
    <Card className="bg-gray-900/90 border-gray-700 shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="aspect-w-4 aspect-h-3 relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="object-cover rounded-t-md"
        />
        {product.is_out_of_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-md">
            <span className="text-white text-lg font-bold">Esgotado</span>
          </div>
        )}
        {product.promotion_price !== null && product.promotion_price > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold">
            Promoção
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {product.promotion_price !== null && product.promotion_price > 0 ? (
              <>
                <span className="text-gray-500 line-through mr-2">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-yellow-400 text-lg font-bold">
                  {formatCurrency(product.promotion_price)}
                </span>
              </>
            ) : (
              <span className="text-yellow-400 text-lg font-bold">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              disabled={product.is_out_of_stock || isAdding}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
            >
              {isAdding ? (
                <>
                  Adicionando...
                </>
              ) : (
                <>
                  Adicionar
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecreaseQuantity}
                disabled={isRemoving}
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-white font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncreaseQuantity}
                disabled={isAdding}
                className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
