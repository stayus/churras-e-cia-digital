
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StoreSettings } from '@/types/dashboard';

interface DeliverySettingsProps {
  settings: StoreSettings;
  onSave: (settings: Partial<StoreSettings>) => void;
}

const DeliverySettings: React.FC<DeliverySettingsProps> = ({ settings, onSave }) => {
  const [deliverySettings, setDeliverySettings] = useState({
    shippingFee: settings.shippingFee,
    freeShippingRadiusKm: settings.freeShippingRadiusKm
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: number) => {
    setDeliverySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        shippingFee: deliverySettings.shippingFee,
        freeShippingRadiusKm: deliverySettings.freeShippingRadiusKm
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="shipping-fee">Taxa de Entrega (R$)</Label>
          <Input
            id="shipping-fee"
            type="number"
            step="0.01"
            min="0"
            value={deliverySettings.shippingFee}
            onChange={(e) => handleChange('shippingFee', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 5.00"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Valor padrão cobrado pela entrega para a maioria dos clientes.
          </p>
        </div>
        
        <div>
          <Label htmlFor="free-radius">Raio de Entrega Gratuita (Km)</Label>
          <Input
            id="free-radius"
            type="number"
            step="0.1"
            min="0"
            value={deliverySettings.freeShippingRadiusKm}
            onChange={(e) => handleChange('freeShippingRadiusKm', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 2.0"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Distância máxima em km para oferecer entrega gratuita. Use 0 para desativar.
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={isSaving}
      >
        {isSaving ? 'Salvando...' : 'Salvar Configurações de Entrega'}
      </Button>
    </div>
  );
};

export default DeliverySettings;
