
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useCart, PaymentMethod } from '@/contexts/cart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';
import { CustomerAddress } from '@/hooks/useAddressManager';

export const useCheckout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [observations, setObservations] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isPickup, setIsPickup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fixed shipping fee amount
  const shippingFee = isPickup ? 0 : 5.00;
  
  // Calculate subtotal of items
  const subtotal = cart.items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    const extraTotal = item.extras?.reduce((sum, extra) => sum + extra.price * item.quantity, 0) || 0;
    return acc + itemTotal + extraTotal;
  }, 0);
  
  // Total order amount
  const total = subtotal + shippingFee;
  
  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isPickup && !selectedAddress) {
      toast({
        title: "Endereço não selecionado",
        description: "Selecione um endereço de entrega ou escolha retirar no local.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare order address
      let orderAddress: any = { pickup: true };
      
      if (!isPickup && selectedAddress) {
        orderAddress = {
          street: selectedAddress.street,
          number: selectedAddress.number,
          complement: selectedAddress.complement,
          neighborhood: selectedAddress.neighborhood,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip_code: selectedAddress.zip_code
        };
      }
      
      // Transform cart items for backend
      const orderItems = cart.items.map(item => ({
        id: item.id,
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        extras: item.extras || []
      }));
      
      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_id: user!.id,
          items: orderItems as unknown as Json,
          total: total,
          status: 'received',
          payment_method: paymentMethod,
          address: orderAddress as Json,
          observations: observations || null
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }
      
      // Clear cart after order is created
      clearCart();
      
      // Show payment-specific success message
      let successMessage = `Seu pedido #${order.id.substring(0, 8)} foi recebido!`;
      
      if (paymentMethod === 'pix') {
        successMessage += ' Você receberá as informações do PIX em breve.';
      } else if (paymentMethod === 'dinheiro') {
        successMessage += ' O pagamento será feito na entrega.';
      }
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: successMessage,
        variant: "default"
      });
      
      // Redirect to orders page
      navigate('/pedidos');
      
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      toast({
        title: "Erro ao finalizar pedido",
        description: error.message || 'Ocorreu um erro ao processar o pedido. Tente novamente.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    observations,
    setObservations,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    isPickup,
    setIsPickup,
    isSubmitting,
    shippingFee,
    subtotal,
    total,
    handleCheckout
  };
};
