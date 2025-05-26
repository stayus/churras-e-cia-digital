
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

  // Fetch store settings for PIX key
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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
        <CustomerLayout>
          <Helmet>
            <title>Carrinho - Churrasquinho & Cia</title>
          </Helmet>
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center py-12 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white leading-tight">
                Seu carrinho está{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  vazio
                </span>
              </h2>
              <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed">
                Adicione alguns produtos deliciosos ao seu carrinho
              </p>
              <Button 
                onClick={() => window.location.href = '/cardapio'}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-full"
              >
                Ver Cardápio
              </Button>
            </div>
          </div>
        </CustomerLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      <CustomerLayout>
        <Helmet>
          <title>Carrinho - Churrasquinho & Cia</title>
        </Helmet>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Finalizar{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Pedido
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Estamos quase lá! Confirme seus dados e finalize seu pedido
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Seus Itens</CardTitle>
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
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Opções de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pickup"
                      checked={isPickup}
                      onCheckedChange={handlePickupChange}
                      className="border-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                    />
                    <Label htmlFor="pickup" className="text-white font-medium">Retirar no local (Grátis)</Label>
                  </div>

                  {!isPickup && (
                    <div>
                      <Label className="text-base font-medium text-yellow-400">Endereço de Entrega</Label>
                      <div className="mt-2">
                        <NewAddressSelector
                          userId={user!.id}
                          onAddressSelected={setSelectedAddress}
                          selectedAddress={selectedAddress}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '600ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" className="border-yellow-400 text-yellow-400" />
                        <Label htmlFor="pix" className="font-medium text-white">PIX</Label>
                      </div>
                      {paymentMethod === 'pix' && storeSettings?.pix_key && (
                        <div className="ml-6 p-4 bg-blue-900/50 rounded-lg border border-blue-600">
                          <p className="text-sm text-blue-300 mb-2">
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

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dinheiro" id="dinheiro" className="border-yellow-400 text-yellow-400" />
                        <Label htmlFor="dinheiro" className="font-medium text-white">Dinheiro</Label>
                      </div>
                      {paymentMethod === 'dinheiro' && (
                        <div className="ml-6 p-4 bg-green-900/50 rounded-lg border border-green-600">
                          <p className="text-sm text-green-300">
                            O pagamento será feito na entrega.
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cartao" id="cartao" className="border-yellow-400 text-yellow-400" />
                        <Label htmlFor="cartao" className="font-medium text-white">Cartão</Label>
                      </div>
                      {paymentMethod === 'cartao' && (
                        <div className="ml-6 p-4 bg-purple-900/50 rounded-lg border border-purple-600">
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
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '800ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Alguma observação especial para seu pedido?"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20 bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '1000ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Taxa de entrega:</span>
                      <span>{formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between font-bold text-lg text-yellow-400">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout} 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold transition-all duration-300 hover:scale-105" 
                    size="lg"
                    disabled={isSubmitting || (!isPickup && !selectedAddress)}
                  >
                    {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CustomerLayout>
    </div>
  );
};

export default CartPage;
