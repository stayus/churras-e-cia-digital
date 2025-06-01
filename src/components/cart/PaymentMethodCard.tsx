
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import type { PaymentMethod } from '@/contexts/cart';

interface PaymentMethodCardProps {
  paymentMethod: string;
  setPaymentMethod: (method: PaymentMethod) => void;
}

const PaymentMethodCard = ({ paymentMethod, setPaymentMethod }: PaymentMethodCardProps) => {
  const [storeSettings, setStoreSettings] = useState<any>(null);

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

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  return (
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
  );
};

export default PaymentMethodCard;
