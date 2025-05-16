
import { OrderHistoryCard } from "@/components/orders/OrderHistoryCard";
import { useOrdersPage } from "@/hooks/useOrdersPage";

const OrdersPage = () => {
  const { pageTitle, historyTitle } = useOrdersPage();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      <OrderHistoryCard title={historyTitle} />
    </div>
  );
};

export default OrdersPage;
