
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrdersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa de histórico de pedidos será implementada em breve.</p>
          <p>Aqui você poderá acompanhar o status dos seus pedidos.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
