
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { OrderListSidebar } from "./orders/OrderListSidebar";
import { OrderDetails } from "./orders/OrderDetails";
import { Order } from "@/types/orders";

const OrdersList = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando pedidos...</span>
      </div>
    );
  }

  // Get status options for the selected order
  const statusOptions = selectedOrder 
    ? getAvailableStatusOptions(selectedOrder.status) 
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <OrderListSidebar
          orders={orders}
          selectedOrder={selectedOrder}
          onSelectOrder={handleSelectOrder}
        />
      </div>

      <div className="md:col-span-2">
        <OrderDetails
          order={selectedOrder}
          statusOptions={statusOptions}
          onUpdateStatus={handleStatusUpdate}
          onBack={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};

export default OrdersList;
