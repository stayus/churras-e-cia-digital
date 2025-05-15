
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DeliveryHeaderProps {
  onAddTier: () => void;
}

const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({ onAddTier }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-medium">Faixas de Entrega</h2>
      <Button 
        onClick={onAddTier} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Faixa
      </Button>
    </div>
  );
};

export default DeliveryHeader;
