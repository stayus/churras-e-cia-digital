
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
              : order.items) as Order['items']
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

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders
  };
};
