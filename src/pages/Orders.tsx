
import { CustomerOrdersList } from "@/components/orders/CustomerOrdersList";
import { useOrdersPage } from "@/hooks/useOrdersPage";
import CustomerLayout from "@/components/customer/CustomerLayout";
import SimpleFooter from "@/components/shared/SimpleFooter";
import { Helmet } from "react-helmet-async";

const OrdersPage = () => {
  const { pageTitle } = useOrdersPage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <CustomerLayout>
          <Helmet>
            <title>Meus Pedidos - Churrasquinho & Cia</title>
          </Helmet>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meus Pedidos
              </h1>
              <p className="text-lg text-gray-600">
                Acompanhe o status dos seus pedidos em tempo real
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <CustomerOrdersList />
            </div>
          </div>
        </CustomerLayout>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default OrdersPage;
