
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CartObservationsCardProps {
  observations: string;
  setObservations: (value: string) => void;
}

const CartObservationsCard = ({ observations, setObservations }: CartObservationsCardProps) => {
  return (
    <Card className="brand-card animate-fade-in" style={{ animationDelay: '800ms' }}>
      <CardHeader>
        <CardTitle className="text-yellow-400 heading-sm">Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Alguma observação especial para seu pedido?"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={4}
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
        />
      </CardContent>
    </Card>
  );
};

export default CartObservationsCard;
