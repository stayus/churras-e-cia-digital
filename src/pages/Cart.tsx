
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/auth';
import { useCart } from '@/contexts/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import CustomerLayout from '@/components/customer/CustomerLayout';
import CartItems from '@/components/cart/CartItems';
import NewAddressSelector from '@/components/customer/NewAddressSelector';
import { useCheckout } from '@/components/cart/useCheckout';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/format';
import type { PaymentMethod } from '@/contexts/cart';
import type { CheckedState } from '@radix-ui/react-checkbox';
import SimpleFooter from '@/components/shared/SimpleFooter';

const CartPage = () => {
  const { user } = useAuth();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [storeSettings, setStoreSettings] = useState<any>(null);
  
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

  useEffect(() => {
    const fetchStoreSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .single();
      setStoreSettings(data);
    };
    
    fetchStoreSettings();
  }, []);

  const handlePickupChange = (checked: CheckedState) => {
    setIsPickup(checked === true);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <CustomerLayout>
            <Helmet>
              <title>Carrinho - Churrasquinho & Cia</title>
            </Helmet>
            <div className="content-container">
              <div className="text-center py-16 animate-fade-in">
                <div className="brand-card max-w-lg mx-auto p-12">
                  <div className="text-6xl mb-6">🛒</div>
                  <h2 className="heading-lg text-white mb-6">
                    Seu carrinho está <span className="gradient-text">vazio</span>
                  </h2>
                  <p className="text-gray-300 mb-8 text-body">
                    Adicione alguns produtos deliciosos ao seu carrinho
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/cardapio'}
                    className="brand-button-primary"
                  >
                    Ver Cardápio
                  </Button>
                </div>
              </div>
            </div>
          </CustomerLayout>
        </div>
        <SimpleFooter />
      </div>
    );
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
                <Card className="brand-card animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <CardHeader>
                    <CardTitle className="text-yellow-400 heading-sm">Opções de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="pickup"
                        checked={isPickup}
                        onCheckedChange={handlePickupChange}
                        className="border-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                      />
                      <Label htmlFor="pickup" className="text-white font-medium text-body-sm">
                        Retirar no local (Grátis)
                      </Label>
                    </div>

                    {!isPickup && (
                      <div>
                        <Label className="text-yellow-400 font-semibold mb-3 block">
                          Endereço de Entrega (opcional)
                        </Label>
                        <NewAddressSelector
                          selectedAddress={selectedAddress}
                          onAddressSelect={setSelectedAddress}
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          Se não informar um endereço, entraremos em contato para confirmar.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="brand-card animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <CardHeader>
                    <CardTitle className="text-yellow-400 heading-sm">Forma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="pix" id="pix" className="border-yellow-400 text-yellow-400" />
                          <Label htmlFor="pix" className="font-medium text-white text-body-sm">PIX</Label>
                        </div>
                        {paymentMethod === 'pix' && storeSettings?.pix_key && (
                          <div className="ml-6 p-4 glass-effect rounded-lg border border-blue-600/30">
                            <p className="text-sm text-blue-300 mb-2 font-medium">
                              <strong>PIX:</strong> {storeSettings.pix_key}
                            </p>
                            <p className="text-sm text-blue-200">
                              Por favor, envie o comprovante para nossa equipe no WhatsApp: {' '}
                              <a 
                                href={storeSettings.whatsapp_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium underline text-yellow-400 hover:text-yellow-300"
                              >
                                {storeSettings.store_phone}
                              </a>
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="dinheiro" id="dinheiro" className="border-yellow-400 text-yellow-400" />
                          <Label htmlFor="dinheiro" className="font-medium text-white text-body-sm">Dinheiro</Label>
                        </div>
                        {paymentMethod === 'dinheiro' && (
                          <div className="ml-6 p-4 glass-effect rounded-lg border border-green-600/30">
                            <p className="text-sm text-green-300">
                              O pagamento será feito na entrega.
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="cartao" id="cartao" className="border-yellow-400 text-yellow-400" />
                          <Label htmlFor="cartao" className="font-medium text-white text-body-sm">Cartão</Label>
                        </div>
                        {paymentMethod === 'cartao' && (
                          <div className="ml-6 p-4 glass-effect rounded-lg border border-purple-600/30">
                            <p className="text-sm text-purple-300">
                              O pagamento será feito na entrega.
                            </p>
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Observations */}
                <Card className="brand-card animate-fade-in" style={{ animationDelay: '800ms' }}>
                  <CardHeader>
                    <CardTitle className="text-yellow-400 heading-sm">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Alguma observação especial para seu pedido?"
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      rows={4}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-20 brand-card animate-fade-in" style={{ animationDelay: '1000ms' }}>
                  <CardHeader>
                    <CardTitle className="text-yellow-400 heading-sm">Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-white text-body-sm">
                        <span className="text-yellow-400">Subtotal:</span>
                        <span className="font-semibold text-yellow-400">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-white text-body-sm">
                        <span className="text-yellow-400">Taxa de entrega:</span>
                        <span className="font-semibold text-yellow-400">{formatCurrency(shippingFee)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-3">
                        <div className="flex justify-between font-bold text-xl text-yellow-400">
                          <span className="text-yellow-400">Total:</span>
                          <span className="text-yellow-400">{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleCheckout} 
                      className="w-full brand-button-primary" 
                      size="lg"
                      disabled={isSubmitting || !paymentMethod}
                    >
                      {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                    </Button>
                    
                    {!paymentMethod && (
                      <p className="text-sm text-red-400 text-center">
                        Selecione uma forma de pagamento
                      </p>
                    )}
                  </CardContent>
                </Card>
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
