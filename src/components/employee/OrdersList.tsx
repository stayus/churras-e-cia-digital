import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Type for orders
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  extras?: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  items: OrderItem[];
  total: number;
  status: 'received' | 'preparing' | 'delivering' | 'completed';
  payment_method: 'pix' | 'dinheiro' | 'cartao';
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    complement?: string;
  };
  created_at: string;
  observations?: string;
}

// Status color mapping
const statusColorMap = {
  received: "bg-blue-500",
  preparing: "bg-yellow-500",
  delivering: "bg-purple-500",
  completed: "bg-green-500",
};

// Status text mapping
const statusTextMap = {
  received: "Pedido recebido",
  preparing: "Em produção",
  delivering: "Saiu para entrega",
  completed: "Pedido finalizado",
};

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_id,
          items,
          total,
          status,
          payment_method,
          address,
          observations,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Fetch customer names for each order
      const ordersWithCustomerNames = await Promise.all(
        data.map(async (order) => {
          const { data: customerData } = await supabase
            .from("customers")
            .select("name")
            .eq("id", order.customer_id)
            .single();

          return {
            ...order,
            customer_name: customerData?.name || "Cliente não encontrado",
            // Convert items from Json to OrderItem[] type
            items: (typeof order.items === 'string' 
              ? JSON.parse(order.items) 
              : order.items) as OrderItem[]
          };
        })
      );

      setOrders(ordersWithCustomerNames as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pedidos",
        description: "Não foi possível obter a lista de pedidos.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      // Call the update-order-status edge function
      const response = await supabase.functions.invoke('update-order-status', {
        body: {
          orderId,
          status: newStatus,
          token
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Falha ao atualizar status');
      }
      
      toast({
        title: "Status atualizado",
        description: `Status do pedido alterado para ${statusTextMap[newStatus as keyof typeof statusTextMap]}`,
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as 'received' | 'preparing' | 'delivering' | 'completed' } 
          : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus as 'received' | 'preparing' | 'delivering' | 'completed'
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar status do pedido",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Refresh orders when there's a change
          fetchOrders();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando pedidos...</span>
      </div>
    );
  }

  // Function to determine which status options are available for updating
  const getAvailableStatusOptions = (currentStatus: string) => {
    // Default options for employees
    const options = [];
    
    // Always allow to move forward in the workflow
    if (currentStatus === 'received') {
      options.push({ value: 'preparing', label: 'Em produção' });
    } 
    else if (currentStatus === 'preparing') {
      options.push({ value: 'delivering', label: 'Saiu para entrega' });
    }
    
    // Only allow moving backwards for certain statuses
    if (currentStatus === 'preparing') {
      options.push({ value: 'received', label: 'Pedido recebido' });
    }
    else if (currentStatus === 'delivering' && user?.role === 'admin') {
      // Only admin can move back from delivering
      options.push({ value: 'preparing', label: 'Em produção' });
    }
    
    // Only motoboys can mark as completed
    if (currentStatus === 'delivering' && user?.role === 'motoboy') {
      options.push({ value: 'completed', label: 'Pedido finalizado' });
    }
    
    return options;
  };

  const formatPaymentMethod = (method: string) => {
    switch(method) {
      case 'pix': return 'PIX';
      case 'dinheiro': return 'Dinheiro';
      case 'cartao': return 'Cartão';
      default: return method;
    }
  };
  
  // Calculate total items in an order
  const calculateTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Lista de Pedidos</h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card 
                  key={order.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedOrder?.id === order.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedOrder(order)}
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
      </div>

      <div className="md:col-span-2">
        {selectedOrder ? (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pedido #{selectedOrder.id.substring(0, 8)}</CardTitle>
              <CardDescription>
                Criado em {format(new Date(selectedOrder.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Badge className={statusColorMap[selectedOrder.status]}>
                  {statusTextMap[selectedOrder.status]}
                </Badge>
                <Badge variant="outline">
                  {formatPaymentMethod(selectedOrder.payment_method)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Cliente</h3>
                <p>{selectedOrder.customer_name}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                <p>
                  {selectedOrder.address.street}, {selectedOrder.address.number}
                  {selectedOrder.address.complement && `, ${selectedOrder.address.complement}`}
                </p>
                <p>{selectedOrder.address.neighborhood}, {selectedOrder.address.city}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Itens</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <div>
                        <p>
                          {item.quantity}x {item.productName}
                        </p>
                        {item.extras && item.extras.length > 0 && (
                          <ul className="text-sm text-muted-foreground">
                            {item.extras.map((extra, i) => (
                              <li key={i}>{extra.name} (+R$ {extra.price.toFixed(2)})</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <p className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.observations && (
                <div>
                  <h3 className="font-medium mb-2">Observações</h3>
                  <p className="text-muted-foreground">{selectedOrder.observations}</p>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <p className="font-bold">Total</p>
                <p className="font-bold">R$ {selectedOrder.total.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <p className="font-medium">Atualizar status:</p>
                <Select
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  disabled={selectedOrder.status === 'completed' || getAvailableStatusOptions(selectedOrder.status).length === 0}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableStatusOptions(selectedOrder.status).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                Voltar
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex justify-center items-center h-full rounded-lg border border-dashed p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Selecione um Pedido</h3>
              <p className="text-muted-foreground">
                Clique em um pedido à esquerda para ver os detalhes e gerenciar seu status
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
