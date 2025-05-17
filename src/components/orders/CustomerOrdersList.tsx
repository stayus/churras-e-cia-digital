
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, statusTextMap, statusColorMap, calculateTotalItems, formatPaymentMethod } from "@/types/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, Calendar, MapPin } from "lucide-react";

export const CustomerOrdersList: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Parse JSON data from Supabase to match the Order type
      const parsedOrders: Order[] = data.map((order: any) => ({
        ...order,
        address: typeof order.address === 'string' ? JSON.parse(order.address) : order.address,
        items: Array.isArray(order.items) 
          ? order.items.map((item: any) => ({
              ...item,
              extras: Array.isArray(item.extras) ? item.extras : []
            })) as OrderItem[]
          : [],
        // Make sure status is one of the allowed values
        status: (order.status === 'received' || 
                order.status === 'preparing' || 
                order.status === 'delivering' || 
                order.status === 'completed') 
                ? order.status : 'received'
      }));
      
      setOrders(parsedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const channel = supabase
      .channel('customer-orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `customer_id=eq.${user?.id}` 
        },
        (payload) => {
          console.log("Order update received:", payload);
          fetchOrders();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground mt-2">
              Você ainda não fez nenhum pedido. Que tal fazer o seu primeiro agora?
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const formattedDate = format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  const totalItems = calculateTotalItems(order.items);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Pedido de</p>
            <CardTitle className="text-lg font-semibold">
              {formattedDate}
            </CardTitle>
          </div>
          <Badge 
            className={`${statusColorMap[order.status]} text-white`}
          >
            {statusTextMap[order.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex items-center text-sm mb-2">
            <MapPin size={16} className="mr-2 text-muted-foreground" />
            <span>Endereço de entrega:</span>
          </div>
          <p className="text-sm">{order.address.street}, {order.address.number}</p>
          <p className="text-sm">{order.address.neighborhood}, {order.address.city}</p>
          {order.address.complement && <p className="text-sm">Complemento: {order.address.complement}</p>}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <p className="font-medium">Itens do pedido:</p>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <span className="font-medium">{item.quantity}x</span> {item.productName}
                {item.extras && item.extras.length > 0 && (
                  <div className="ml-6 text-sm text-muted-foreground">
                    {item.extras.map((extra, i) => (
                      <div key={i}>+ {extra.name}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                R$ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between font-medium">
          <div className="flex items-center">
            <Package size={16} className="mr-2" />
            <span>Total ({totalItems} itens)</span>
          </div>
          <span>R$ {order.total.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="text-muted-foreground">Forma de pagamento:</span>
          <span>{formatPaymentMethod(order.payment_method)}</span>
        </div>
        
        {order.observations && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <p className="text-sm font-medium">Observações:</p>
            <p className="text-sm">{order.observations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
