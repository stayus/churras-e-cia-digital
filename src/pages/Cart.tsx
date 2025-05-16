
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/format';
import { Trash, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import AddressSelector from '@/components/customer/AddressSelector';
import { 
  Sheet, SheetContent, SheetDescription, 
  SheetHeader, SheetTitle, SheetTrigger 
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [observations, setObservations] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartao'>('pix');
  const [isPickup, setIsPickup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Valor fixo do frete
  const shippingFee = isPickup ? 0 : 5.00;
  
  // Calcular subtotal dos itens
  const subtotal = cart.items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    const extraTotal = item.extras?.reduce((sum, extra) => sum + extra.price * item.quantity, 0) || 0;
    return acc + itemTotal + extraTotal;
  }, 0);
  
  // Total geral
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
    
    if (!isPickup && !selectedAddressId) {
      toast({
        title: "Endereço não selecionado",
        description: "Selecione um endereço de entrega ou escolha retirar no local.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Obter endereço selecionado se não for retirada no local
      let orderAddress = { pickup: true };
      
      if (!isPickup) {
        // Buscar endereço do cliente no Supabase
        const { data: customerData } = await supabase
          .from('customers')
          .select('addresses')
          .eq('id', user!.id)
          .single();
          
        if (!customerData?.addresses) {
          throw new Error('Não foi possível encontrar os endereços do usuário');
        }
        
        const addresses = customerData.addresses as any[];
        const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
        
        if (!selectedAddress) {
          throw new Error('Endereço selecionado não encontrado');
        }
        
        orderAddress = selectedAddress;
      }
      
      // Criar pedido no banco de dados
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_id: user!.id,
          items: cart.items,
          total: total,
          status: isPickup ? 'awaiting_pickup' : 'received',
          payment_method: paymentMethod,
          address: orderAddress,
          observations: observations || null
        })
        .select('id')
        .single();
        
      if (error) {
        throw error;
      }
      
      // Limpar o carrinho após o pedido ser criado
      clearCart();
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido #${order.id.substring(0, 8)} foi recebido e está sendo processado.`,
        variant: "default"
      });
      
      // Redirecionar para a página de pedidos
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
  
  if (cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center justify-center py-10">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
                <p className="text-gray-500 mb-6">Adicione alguns produtos para começar</p>
                <Button onClick={() => navigate('/')}>
                  Ver produtos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CustomerLayout>
    );
  }
  
  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map((item) => {
                    // Calcular preço do item com extras
                    const extraTotal = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
                    const itemPriceWithExtras = item.price + extraTotal;
                    const itemTotal = itemPriceWithExtras * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.imageUrl || '/placeholder.svg'} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          
                          {item.extras && item.extras.length > 0 && (
                            <div className="mt-1 text-sm text-gray-500">
                              <span>Adicionais: </span>
                              {item.extras.map((extra, idx) => (
                                <span key={extra.id}>
                                  {extra.name} 
                                  {idx < item.extras!.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-1 flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {formatCurrency(itemPriceWithExtras)}
                            </span>
                            
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="font-medium">{formatCurrency(itemTotal)}</span>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 mt-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Alguma observação sobre o seu pedido? Ex.: ponto da carne, remover algum ingrediente, etc."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="pickup"
                      checked={isPickup}
                      onChange={(e) => setIsPickup(e.target.checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="pickup">Retirar no local</Label>
                  </div>
                  
                  {!isPickup ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Frete:</span>
                        <span>{formatCurrency(shippingFee)}</span>
                      </div>
                      
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            {selectedAddressId ? "Mudar endereço" : "Selecionar endereço"}
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Selecione o endereço de entrega</SheetTitle>
                            <SheetDescription>
                              Escolha um endereço cadastrado ou adicione um novo
                            </SheetDescription>
                          </SheetHeader>
                          <div className="py-4">
                            <AddressSelector
                              userId={user?.id || ''}
                              onAddressSelected={setSelectedAddressId}
                              selectedAddressId={selectedAddressId}
                            />
                          </div>
                        </SheetContent>
                      </Sheet>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Retirada no local:</span>
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Grátis
                      </span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Forma de pagamento</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as 'pix' | 'dinheiro' | 'cartao')}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix">PIX</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro">Dinheiro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao">Cartão (na entrega)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isSubmitting || (!isPickup && !selectedAddressId)}
                >
                  {isSubmitting ? "Processando..." : "Finalizar Pedido"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CartPage;
