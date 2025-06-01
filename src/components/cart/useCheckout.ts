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

  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = isPickup ? 0 : 5;
  const total = subtotal + shippingFee;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const findOrCreateCustomer = async () => {
    if (!user) {
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

      if (error || !customer) {
        console.error('Erro ao criar cliente convidado:', error);
        throw new Error('Erro ao criar cliente');
      }

      return customer.id;
    }

    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (existingCustomer) return existingCustomer.id;

    const customerData = {
      id: user.id,
      name: user.email?.split('@')[0] || 'Cliente',
      email: user.email || `user_${user.id}@temp.com`,
      password: 'auth_user',
      addresses: []
    };

    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();

    if (createError || !newCustomer) {
      console.error('Erro ao criar cliente:', createError);
      throw new Error('Erro ao criar cliente');
    }

    return newCustomer.id;
  };

  const processCheckout = async (checkoutData: CheckoutData) => {
    if (cart.items.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Seu carrinho está vazio',
      });
      return false;
    }

    setIsProcessing(true);

    try {
      const customerId = await findOrCreateCustomer();

      const addressData = isPickup
        ? {
            street: 'Retirada no local',
            number: 'N/A',
            neighborhood: 'Centro',
            city: 'Loja',
            complement: 'Retirada no local',
          }
        : checkoutData.address;

      const orderData = {
        customer_id: customerId,
        items: cart.items,
        total,
        address: addressData,
        payment_method: checkoutData.paymentMethod,
        observations: checkoutData.observations || null,
        status: 'received',
      };

      // Aguarda 400ms antes de enviar pedido ao Supabase
      await delay(400);

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error || !order) {
        throw new Error(error?.message || 'Erro ao criar pedido');
      }

      clearCart();

      toast({
        title: 'Pedido realizado com sucesso!',
        description: `Seu pedido #${order.id.slice(0, 8)} foi criado e está sendo processado.`,
      });

      navigate('/pedidos');
      return true;
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao processar pedido',
        description: error.message || 'Tente novamente em alguns minutos',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione uma forma de pagamento',
      });
      return;
    }

    const checkoutData: CheckoutData = {
      address: isPickup
        ? {}
        : selectedAddress || {
            street: 'Endereço não informado',
            number: 'S/N',
            neighborhood: 'Centro',
            city: 'Cidade',
            complement: '',
          },
      paymentMethod,
      observations,
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
    handleCheckout,
  };
};
