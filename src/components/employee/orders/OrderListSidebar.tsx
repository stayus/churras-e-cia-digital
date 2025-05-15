
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Order, statusColorMap, statusTextMap, calculateTotalItems } from "@/types/orders";

interface OrderListSidebarProps {
  orders: Order[];
  selectedOrder: Order | null;
  onSelectOrder: (order: Order) => void;
  loading?: boolean;
}

export const OrderListSidebar = ({
  orders,
  selectedOrder,
  onSelectOrder,
  loading = false
}: OrderListSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchTermLower) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTermLower)) ||
      order.address.street.toLowerCase().includes(searchTermLower) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchTermLower))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Lista de Pedidos</h3>
      
      <Input
        placeholder="Pesquisar pedidos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${selectedOrder?.id === order.id ? 'border-primary' : ''}`}
              onClick={() => onSelectOrder(order)}
            >
              <CardHeader className="py-3">
                <div className="flex justify-between items-center">
                  <Badge className={statusColorMap[order.status]}>
                    {statusTextMap[order.status]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {calculateTotalItems(order.items)} itens • R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
