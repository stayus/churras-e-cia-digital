
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";
import { toast } from "@/hooks/use-toast";

type UserRole = 'admin' | 'employee' | 'motoboy' | 'customer' | string; // Adicionamos string para aceitar qualquer role de funcionário

interface StatusOption {
  value: string;
  label: string;
}

export const useOrderDetails = (userRole?: UserRole) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Verifica se o usuário é funcionário (não cliente)
  const isEmployee = userRole && userRole !== 'customer';

  // Atualiza o status do pedido
  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    // Somente funcionários podem atualizar o status do pedido
    if (!isEmployee) {
      toast({
        variant: "destructive",
        title: "Permissão negada",
        description: "Você não tem permissão para atualizar o status do pedido."
      });
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke("update-order-status", {
        body: { orderId, newStatus }
      });

      if (error) {
        console.error("Error updating order status:", error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar status",
          description: "Não foi possível atualizar o status do pedido."
        });
        return false;
      }

      toast({
        title: "Status atualizado",
        description: `Pedido #${orderId.substr(0, 8)} atualizado para "${newStatus}".`
      });
      return true;
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao processar a solicitação."
      });
      return false;
    }
  };

  // Obtém as opções de status disponíveis com base no status atual
  const getAvailableStatusOptions = (currentStatus?: string): StatusOption[] => {
    // Somente funcionários podem ver opções de status
    if (!isEmployee) return [];

    // Se não tiver status atual, retorne vazio
    if (!currentStatus) return [];

    // Opções de status disponíveis para cada status atual
    switch (currentStatus) {
      case "received":
        return [
          { value: "preparing", label: "Em preparação" }
        ];
      case "preparing":
        return [
          { value: "delivering", label: "Em entrega" }
        ];
      case "delivering":
        return [
          { value: "completed", label: "Entregue" }
        ];
      case "completed":
        return []; // Pedido já finalizado
      default:
        return [];
    }
  };

  return {
    selectedOrder,
    setSelectedOrder,
    updateOrderStatus,
    getAvailableStatusOptions
  };
};
