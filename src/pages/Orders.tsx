
import { CustomerOrdersList } from "@/components/orders/CustomerOrdersList";
import { useOrdersPage } from "@/hooks/useOrdersPage";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Helmet } from "react-helmet-async";

const OrdersPage = () => {
  const { pageTitle } = useOrdersPage();
  
  return (
    <div className="page-container">
      <CustomerLayout>
        <Helmet>
          <title>Meus Pedidos - Churrasquinho & Cia</title>
        </Helmet>
        <div className="content-container">
          <div className="page-header">
            <h1 className="page-title">
              Meus <span className="gradient-text">Pedidos</span>
            </h1>
            <p className="page-subtitle">
              Acompanhe o status dos seus pedidos em tempo real
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CustomerOrdersList />
          </div>
        </div>
      </CustomerLayout>
    </div>
  );
};

export default OrdersPage;
