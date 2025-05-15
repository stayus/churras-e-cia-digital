
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/orders";
import { supabase } from "@/integrations/supabase/client";

export const useOrderDetails = (userRole?: string) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

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
        description: `Status do pedido alterado com sucesso`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar status do pedido",
      });
      return false;
    }
  };

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
    else if (currentStatus === 'delivering' && userRole === 'admin') {
      // Only admin can move back from delivering
      options.push({ value: 'preparing', label: 'Em produção' });
    }
    
    // Only motoboys can mark as completed
    if (currentStatus === 'delivering' && userRole === 'motoboy') {
      options.push({ value: 'completed', label: 'Pedido finalizado' });
    }
    
    return options;
  };

  return {
    selectedOrder,
    setSelectedOrder,
    updateOrderStatus,
    getAvailableStatusOptions
  };
};
