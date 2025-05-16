
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';

interface ObservationsCardProps {
  observations: string;
  setObservations: (value: string) => void;
}

const ObservationsCard = ({ observations, setObservations }: ObservationsCardProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Alguma observação sobre o seu pedido? Ex.: ponto da carne, remover algum ingrediente, etc."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

export default ObservationsCard;
