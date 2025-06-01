
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';

interface CheckoutSummaryProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  isSubmitting: boolean;
  paymentMethod: string;
  onCheckout: () => void;
}

const CheckoutSummary = ({ 
  subtotal, 
  shippingFee, 
  total, 
  isSubmitting, 
  paymentMethod, 
  onCheckout 
}: CheckoutSummaryProps) => {
  return (
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
          onClick={onCheckout} 
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
  );
};

export default CheckoutSummary;
