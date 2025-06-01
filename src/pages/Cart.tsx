
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerLayout from '@/components/customer/CustomerLayout';
import CartItems from '@/components/cart/CartItems';
import EmptyCartPage from '@/components/cart/EmptyCartPage';
import DeliveryOptionsCard from '@/components/cart/DeliveryOptionsCard';
import PaymentMethodCard from '@/components/cart/PaymentMethodCard';
import CartObservationsCard from '@/components/cart/CartObservationsCard';
import CheckoutSummary from '@/components/cart/CheckoutSummary';
import { useCheckout } from '@/components/cart/useCheckout';
import SimpleFooter from '@/components/shared/SimpleFooter';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  
  const {
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
  } = useCheckout();

  if (cart.items.length === 0) {
    return <EmptyCartPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <CustomerLayout>
          <Helmet>
            <title>Carrinho - Churrasquinho & Cia</title>
          </Helmet>

          <div className="content-container">
            <div className="page-header">
              <h1 className="page-title text-red-600">
                Finalizar <span className="gradient-text">Pedido</span>
              </h1>
              <p className="page-subtitle">
                Estamos quase lá! Confirme seus dados e finalize seu pedido
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items */}
                <Card className="brand-card animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <CardHeader>
                    <CardTitle className="text-yellow-400 heading-sm">Seus Itens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CartItems 
                      items={cart.items}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      clearCart={clearCart}
                    />
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <DeliveryOptionsCard
                  isPickup={isPickup}
                  setIsPickup={setIsPickup}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />

                {/* Payment Method */}
                <PaymentMethodCard
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />

                {/* Observations */}
                <CartObservationsCard
                  observations={observations}
                  setObservations={setObservations}
                />
              </div>

              {/* Order Summary */}
              <div>
                <CheckoutSummary
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  total={total}
                  isSubmitting={isSubmitting}
                  paymentMethod={paymentMethod}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        </CustomerLayout>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default CartPage;
