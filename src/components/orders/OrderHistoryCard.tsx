
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderHistoryCardProps {
  title: string;
}

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Hora de fazer seu primeiro pedido!</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Você ainda não possui nenhum histórico de pedidos.
          </p>
          <Button onClick={() => navigate('/')}>
            Ver cardápio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
