
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import NewAddressSelector from '@/components/customer/NewAddressSelector';
import { CustomerAddress } from '@/hooks/useAddressManager';
import type { CheckedState } from '@radix-ui/react-checkbox';

interface DeliveryOptionsCardProps {
  isPickup: boolean;
  setIsPickup: (checked: boolean) => void;
  selectedAddress: CustomerAddress | null;
  setSelectedAddress: (address: CustomerAddress | null) => void;
}

const DeliveryOptionsCard = ({ 
  isPickup, 
  setIsPickup, 
  selectedAddress, 
  setSelectedAddress 
}: DeliveryOptionsCardProps) => {
  const handlePickupChange = (checked: CheckedState) => {
    setIsPickup(checked === true);
  };

  return (
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
  );
};

export default DeliveryOptionsCard;
