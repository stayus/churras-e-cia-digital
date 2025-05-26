
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/cart';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomerAddress } from '@/hooks/useAddressManager';

export interface CheckoutData {
  address: CustomerAddress;
  paymentMethod: string;
  observations?: string;
}

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const processCheckout = async (checkoutData: CheckoutData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para fazer um pedido"
      });
      navigate('/login');
      return false;
    }

    if (cart.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Seu carrinho está vazio"
      });
      return false;
    }

    setIsProcessing(true);
    
    try {
      // Calculate total
      const total = cart.items.reduce((sum, item) => {
        const price = item.promotion_price || item.price;
        return sum + (price * item.quantity);
      }, 0);

      // Create order object
      const orderData = {
        customer_id: user.id,
        items: cart.items,
        total: total,
        address: checkoutData.address,
        payment_method: checkoutData.paymentMethod,
        observations: checkoutData.observations || null,
        status: 'received'
      };

      console.log('Creating order with data:', orderData);

      // Insert order into database
      const { data: order, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error(error.message || 'Erro ao criar pedido');
      }

      if (!order) {
        throw new Error('Pedido não foi criado corretamente');
      }

      // Clear cart after successful order
      clearCart();

      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido #${order.id.slice(0, 8)} foi criado e está sendo processado.`
      });

      // Navigate to orders page
      navigate('/pedidos');
      
      return true;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar pedido",
        description: error.message || "Tente novamente em alguns minutos"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCheckout,
    isProcessing
  };
};
