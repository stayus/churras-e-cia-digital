
import { CustomerOrdersList } from "@/components/orders/CustomerOrdersList";
import { useOrdersPage } from "@/hooks/useOrdersPage";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Helmet } from "react-helmet";

const OrdersPage = () => {
  const { pageTitle } = useOrdersPage();
  
  return (
    <CustomerLayout>
      <Helmet>
        <title>Meus Pedidos - Churrasquinho & Cia</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
        <CustomerOrdersList />
      </div>
    </CustomerLayout>
  );
};

export default OrdersPage;
