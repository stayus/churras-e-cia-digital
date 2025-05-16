
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartItemComponent from './CartItem';
import { CartItem } from '@/contexts/cart';

interface CartItemsProps {
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartItems = ({ items, updateQuantity, removeItem, clearCart }: CartItemsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/')}>
          Continuar comprando
        </Button>
        
        <Button variant="destructive" onClick={clearCart}>
          Limpar carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartItems;
