
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import { DeliveryTier } from '@/types/dashboard';

interface DeliveryTierCardProps {
  tier: DeliveryTier;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof DeliveryTier, value: number) => void;
}

const DeliveryTierCard: React.FC<DeliveryTierCardProps> = ({ 
  tier, 
  index, 
  onRemove, 
  onUpdate 
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Faixa de Entrega {index + 1}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemove(tier.id)}
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
            onChange={(e) => onUpdate(tier.id, 'minDistance', parseFloat(e.target.value) || 0)}
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
            onChange={(e) => onUpdate(tier.id, 'maxDistance', parseFloat(e.target.value) || 0)}
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
            onChange={(e) => onUpdate(tier.id, 'fee', parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
};

export default DeliveryTierCard;
