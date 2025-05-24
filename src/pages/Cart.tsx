
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
import OrderSummary from '@/components/cart/OrderSummary';
import NewAddressSelector from '@/components/customer/NewAddressSelector';
import { useCheckout } from '@/components/cart/useCheckout';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/format';

const CartPage = () => {
  const { user } = useAuth();
  const { cart } = useCart();
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

  if (cart.items.length === 0) {
    return (
      <CustomerLayout>
        <Helmet>
          <title>Carrinho - Churrasquinho & Cia</title>
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">Adicione alguns produtos deliciosos ao seu carrinho</p>
            <Button onClick={() => window.location.href = '/catalogo'}>
              Ver Cardápio
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Helmet>
        <title>Carrinho - Churrasquinho & Cia</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Seus Itens</CardTitle>
              </CardHeader>
              <CardContent>
                <CartItems />
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle>Opções de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pickup"
                    checked={isPickup}
                    onCheckedChange={setIsPickup}
                  />
                  <Label htmlFor="pickup">Retirar no local (Grátis)</Label>
                </div>

                {!isPickup && (
                  <div>
                    <Label className="text-base font-medium">Endereço de Entrega</Label>
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
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="font-medium">PIX</Label>
                    </div>
                    {paymentMethod === 'pix' && storeSettings?.pix_key && (
                      <div className="ml-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>PIX:</strong> {storeSettings.pix_key}
                        </p>
                        <p className="text-sm text-blue-600">
                          Por favor, envie o comprovante para nossa equipe no WhatsApp: {' '}
                          <a 
                            href={storeSettings.whatsapp_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium underline"
                          >
                            {storeSettings.store_phone}
                          </a>
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro" className="font-medium">Dinheiro</Label>
                    </div>
                    {paymentMethod === 'dinheiro' && (
                      <div className="ml-6 p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          O pagamento será feito na entrega.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao" className="font-medium">Cartão</Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Observations */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Alguma observação especial para seu pedido?"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega:</span>
                    <span>{formatCurrency(shippingFee)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full" 
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
  );
};

export default CartPage;
