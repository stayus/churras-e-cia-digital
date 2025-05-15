
import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types/orders";

export const useOrdersList = () => {
  const { orders, loading } = useOrders();
  const { user } = useAuth();
  const { 
    selectedOrder, 
    setSelectedOrder, 
    updateOrderStatus,
    getAvailableStatusOptions 
  } = useOrderDetails(user?.role);

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    
    if (success && selectedOrder) {
      // Update the selected order status locally
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus as 'received' | 'preparing' | 'delivering' | 'completed'
      });
    }
  };

  // Get status options for the selected order
  const statusOptions = selectedOrder 
    ? getAvailableStatusOptions(selectedOrder.status) 
    : [];

  return {
    orders,
    loading,
    selectedOrder,
    statusOptions,
    handleSelectOrder,
    handleStatusUpdate,
    onBack: () => setSelectedOrder(null)
  };
};
