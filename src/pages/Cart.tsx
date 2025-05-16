
import React from 'react';
import { useCart } from '@/contexts/cart';
import { useAuth } from '@/contexts/AuthContext';
import CustomerLayout from '@/components/customer/CustomerLayout';
import CartItems from '@/components/cart/CartItems';
import OrderSummary from '@/components/cart/OrderSummary';
import ObservationsCard from '@/components/cart/ObservationsCard';
import EmptyCart from '@/components/cart/EmptyCart';
import { useCheckout } from '@/components/cart/useCheckout';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const {
    observations,
    setObservations,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    isPickup,
    setIsPickup,
    isSubmitting,
    shippingFee,
    subtotal,
    handleCheckout
  } = useCheckout();
  
  if (cart.items.length === 0) {
    return (
      <CustomerLayout>
        <EmptyCart />
      </CustomerLayout>
    );
  }
  
  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CartItems 
              items={cart.items}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              clearCart={clearCart}
            />
            
            <ObservationsCard
              observations={observations}
              setObservations={setObservations}
            />
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary
              userId={user?.id || ''}
              subtotal={subtotal}
              isPickup={isPickup}
              setIsPickup={setIsPickup}
              shippingFee={shippingFee}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onCheckout={handleCheckout}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CartPage;
