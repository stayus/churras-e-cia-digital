
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { SettingsData } from '@/types/settings';
import { DeliveryTier } from '@/types/dashboard';
import DeliveryTierCard from './delivery/DeliveryTierCard';
import DeliveryHeader from './delivery/DeliveryHeader';
import { validateDeliveryTiers } from './delivery/DeliveryTierValidator';

interface DeliverySettingsProps {
  settings: SettingsData;
  onSave: (settings: Partial<SettingsData>) => void;
}

const DeliverySettings: React.FC<DeliverySettingsProps> = ({ settings, onSave }) => {
  const [deliveryTiers, setDeliveryTiers] = useState<DeliveryTier[]>(
    settings.deliveryTiers || [
      { id: 'tier-1', minDistance: 0, maxDistance: 3, fee: settings.shippingFee || 5.0 }
    ]
  );
  const [isSaving, setIsSaving] = useState(false);

  const addDeliveryTier = () => {
    const lastTier = deliveryTiers[deliveryTiers.length - 1];
    const newTier: DeliveryTier = {
      id: `tier-${deliveryTiers.length + 1}`,
      minDistance: lastTier ? lastTier.maxDistance : 0,
      maxDistance: lastTier ? lastTier.maxDistance + 3 : 3,
      fee: lastTier ? lastTier.fee + 2 : 5.0
    };
    
    setDeliveryTiers([...deliveryTiers, newTier]);
  };

  const removeDeliveryTier = (id: string) => {
    if (deliveryTiers.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "Deve haver pelo menos uma faixa de entrega.",
        variant: "destructive"
      });
      return;
    }
    setDeliveryTiers(deliveryTiers.filter(tier => tier.id !== id));
  };

  const updateTier = (id: string, field: keyof DeliveryTier, value: number) => {
    setDeliveryTiers(deliveryTiers.map(tier => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      return tier;
    }));
  };

  const handleSave = async () => {
    if (!validateDeliveryTiers(deliveryTiers)) {
      return;
    }
    
    setIsSaving(true);
    try {
      // Save the base shipping fee as the first tier's fee for backward compatibility
      const baseShippingFee = deliveryTiers.length > 0 ? deliveryTiers[0].fee : 5.0;
      
      await onSave({
        shippingFee: baseShippingFee,
        deliveryTiers: deliveryTiers
      });
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de frete foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error("Error saving delivery settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações de frete.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <DeliveryHeader onAddTier={addDeliveryTier} />
        
        <div className="space-y-3">
          {deliveryTiers.map((tier, index) => (
            <DeliveryTierCard 
              key={tier.id}
              tier={tier}
              index={index}
              onRemove={removeDeliveryTier}
              onUpdate={updateTier}
            />
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={isSaving}
      >
        {isSaving ? 'Salvando...' : 'Salvar Configurações de Frete'}
      </Button>
    </div>
  );
};

export default DeliverySettings;
