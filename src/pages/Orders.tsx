
import { CustomerOrdersList } from "@/components/orders/CustomerOrdersList";
import { useOrdersPage } from "@/hooks/useOrdersPage";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Helmet } from "react-helmet-async";

const OrdersPage = () => {
  const { pageTitle } = useOrdersPage();
  
  return (
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h3 className="text-xl font-bold">Churrasquinho&Cia</h3>
              </div>
              <p className="text-gray-400">Sabor que conquista</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Churrasquinho&Cia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </CustomerLayout>
  );
};

export default OrdersPage;
