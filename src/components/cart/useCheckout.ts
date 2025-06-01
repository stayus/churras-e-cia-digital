
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/cart';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomerAddress } from '@/hooks/useAddressManager';

export interface CheckoutData {
  address: CustomerAddress | {};
  paymentMethod: string;
  observations?: string;
}

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [observations, setObservations] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isPickup, setIsPickup] = useState(false);
  
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate subtotal from cart items
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);

  // Calculate shipping fee (free if pickup, otherwise fixed fee)
  const shippingFee = isPickup ? 0 : 5;

  // Calculate total
  const total = subtotal + shippingFee;

  const findOrCreateCustomer = async () => {
    if (!user) {
      // Para usuários não logados, criar um registro temporário
      const guestData = {
        name: 'Cliente',
        email: `guest_${Date.now()}@temp.com`,
        password: 'temp_password',
        addresses: []
      };

      const { data: customer, error } = await supabase
        .from('customers')
        .insert(guestData)
        .select()
        .single();

      if (error) {
        console.error('Error creating guest customer:', error);
        throw new Error('Erro ao criar registro do cliente');
      }

      return customer.id;
    }

    // Para usuários logados, tentar encontrar ou criar
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (existingCustomer) {
      return existingCustomer.id;
    }

    // Se não existe, criar novo registro
    const customerData = {
      id: user.id,
      name: user.email?.split('@')[0] || 'Cliente',
      email: user.email || `user_${user.id}@temp.com`,
      password: 'auth_user', // Senha placeholder para usuários autenticados
      addresses: []
    };

    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating customer:', createError);
      throw new Error('Erro ao criar registro do cliente');
    }

    return newCustomer.id;
  };

  const processCheckout = async (checkoutData: CheckoutData) => {
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
      // Encontrar ou criar cliente
      const customerId = await findOrCreateCustomer();

      // Preparar endereço - usar endereço padrão para pickup
      const addressData = isPickup ? {
        street: "Retirada no local",
        number: "N/A",
        neighborhood: "Centro",
        city: "Loja",
        complement: "Retirada no local"
      } : checkoutData.address;

      // Create order object with proper structure for Supabase
      const orderData = {
        customer_id: customerId,
        items: cart.items as any,
        total: total,
        address: addressData as any,
        payment_method: checkoutData.paymentMethod,
        observations: checkoutData.observations || null,
        status: 'received'
      };

      console.log('Creating order with data:', orderData);

      // Insert order into database
      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
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

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma forma de pagamento"
      });
      return;
    }

    // Para pickup, não precisa de endereço
    // Para entrega, usar endereço selecionado ou criar um endereço padrão
    const checkoutData: CheckoutData = {
      address: isPickup ? {} : (selectedAddress || {
        street: "Endereço não informado",
        number: "S/N",
        neighborhood: "Centro",
        city: "Cidade",
        complement: ""
      }),
      paymentMethod,
      observations
    };

    await processCheckout(checkoutData);
  };

  return {
    processCheckout,
    isProcessing,
    observations,
    setObservations,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    isPickup,
    setIsPickup,
    isSubmitting: isProcessing,
    shippingFee,
    subtotal,
    total,
    handleCheckout
  };
};
