
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminOrders = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa de gerenciamento de pedidos será implementada em breve.</p>
          <p>Aqui você poderá visualizar e atualizar o status dos pedidos.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
