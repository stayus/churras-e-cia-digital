
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderHistoryCardProps {
  title: string;
}

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A funcionalidade completa de histórico de pedidos será implementada em breve.</p>
        <p>Aqui você poderá acompanhar o status dos seus pedidos.</p>
      </CardContent>
    </Card>
  );
};
