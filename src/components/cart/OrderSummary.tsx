
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AddressSelector from '@/components/customer/AddressSelector';
import { PaymentMethod } from '@/contexts/cart';

interface OrderSummaryProps {
  userId: string;
  subtotal: number;
  isPickup: boolean;
  setIsPickup: (isPickup: boolean) => void;
  shippingFee: number;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  onCheckout: () => void;
  isSubmitting: boolean;
}

const OrderSummary = ({
  userId,
  subtotal,
  isPickup,
  setIsPickup,
  shippingFee,
  selectedAddressId,
  setSelectedAddressId,
  paymentMethod,
  setPaymentMethod,
  onCheckout,
  isSubmitting
}: OrderSummaryProps) => {
  const total = subtotal + shippingFee;
  
  return (
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
                      userId={userId}
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
            value={paymentMethod || undefined}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
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
          onClick={onCheckout}
          disabled={isSubmitting || (!isPickup && !selectedAddressId)}
        >
          {isSubmitting ? "Processando..." : "Finalizar Pedido"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
