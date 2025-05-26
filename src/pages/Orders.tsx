
import { CustomerOrdersList } from "@/components/orders/CustomerOrdersList";
import { useOrdersPage } from "@/hooks/useOrdersPage";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Helmet } from "react-helmet-async";

const OrdersPage = () => {
  const { pageTitle } = useOrdersPage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      <CustomerLayout>
        <Helmet>
          <title>Meus Pedidos - Churrasquinho & Cia</title>
        </Helmet>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">
              Meus{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Pedidos
              </span>
            </h1>
            <p className="text-gray-300 text-lg">Acompanhe o status dos seus pedidos</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CustomerOrdersList />
          </div>
        </div>
      </CustomerLayout>
    </div>
  );
};

export default OrdersPage;
