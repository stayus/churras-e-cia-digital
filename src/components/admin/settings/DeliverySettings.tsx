import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { SettingsData } from '@/hooks/useSettingsData';

interface DeliverySettingsProps {
  settings: SettingsData;
  onSave: (settings: Partial<SettingsData>) => void;
}

interface DeliveryTier {
  id: string;
  minDistance: number;
  maxDistance: number;
  fee: number;
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

  const validateTiers = () => {
    // Sort tiers by minDistance to check for gaps
    const sortedTiers = [...deliveryTiers].sort((a, b) => a.minDistance - b.minDistance);
    
    // Check if the first tier starts at 0
    if (sortedTiers[0].minDistance !== 0) {
      toast({
        title: "Faixa inválida",
        description: "A primeira faixa deve começar em 0 km.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check for overlaps or gaps between tiers
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      if (sortedTiers[i].maxDistance !== sortedTiers[i + 1].minDistance) {
        toast({
          title: "Faixas inválidas",
          description: "As faixas de entrega devem ser contínuas, sem sobreposições ou lacunas.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    // Check that min is less than max for each tier
    for (const tier of sortedTiers) {
      if (tier.minDistance >= tier.maxDistance) {
        toast({
          title: "Faixa inválida",
          description: "A distância mínima deve ser menor que a distância máxima em cada faixa.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateTiers()) {
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
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Faixas de Entrega</h2>
          <Button 
            onClick={addDeliveryTier} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Faixa
          </Button>
        </div>
        
        <div className="space-y-3">
          {deliveryTiers.map((tier, index) => (
            <Card key={tier.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Faixa de Entrega {index + 1}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeDeliveryTier(tier.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`min-${tier.id}`}>Distância Mínima (Km)</Label>
                  <Input
                    id={`min-${tier.id}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={tier.minDistance}
                    onChange={(e) => updateTier(tier.id, 'minDistance', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`max-${tier.id}`}>Distância Máxima (Km)</Label>
                  <Input
                    id={`max-${tier.id}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={tier.maxDistance}
                    onChange={(e) => updateTier(tier.id, 'maxDistance', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`fee-${tier.id}`}>Taxa de Entrega (R$)</Label>
                  <Input
                    id={`fee-${tier.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={tier.fee}
                    onChange={(e) => updateTier(tier.id, 'fee', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
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
