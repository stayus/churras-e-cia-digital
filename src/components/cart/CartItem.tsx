
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { CartItem } from '@/contexts/cart';

interface CartItemProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItemComponent = ({ item, updateQuantity, removeItem }: CartItemProps) => {
  // Calculate price of item with extras
  const extraTotal = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
  const itemPriceWithExtras = item.price + extraTotal;
  const itemTotal = itemPriceWithExtras * item.quantity;
  
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
        <img 
          src={item.imageUrl || '/placeholder.svg'} 
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        
        {item.extras && item.extras.length > 0 && (
          <div className="mt-1 text-sm text-gray-500">
            <span>Adicionais: </span>
            {item.extras.map((extra, idx) => (
              <span key={extra.id}>
                {extra.name} 
                {idx < item.extras!.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-1 flex justify-between items-center">
          <span className="text-sm font-medium">
            {formatCurrency(itemPriceWithExtras)}
          </span>
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="mx-2 w-8 text-center">{item.quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="font-medium">{formatCurrency(itemTotal)}</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:text-red-500 mt-2"
          onClick={() => removeItem(item.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemComponent;
