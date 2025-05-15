
import { Loader2 } from "lucide-react";
import { OrderListSidebar } from "./orders/OrderListSidebar";
import { OrderDetails } from "./orders/OrderDetails";
import { useOrdersList } from "@/hooks/useOrdersList";

const OrdersList = () => {
  const {
    orders,
    loading,
    selectedOrder,
    statusOptions,
    handleSelectOrder,
    handleStatusUpdate,
    onBack
  } = useOrdersList();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando pedidos...</span>
      </div>
    );
  }

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
          onBack={onBack}
        />
      </div>
    </div>
  );
};

export default OrdersList;
