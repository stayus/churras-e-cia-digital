
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { generateOrderPDF } from "@/utils/pdfGenerator";
import { OrderSearch } from "@/components/employee/orders/OrderSearch";
import { OrdersTable } from "@/components/employee/orders/OrdersTable";
import { Order } from "@/types/orders";

const OrderExports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const { orders, loading } = useOrders();
  const { toast } = useToast();

  // Generate PDF for order
  const handleGeneratePDF = (order: Order) => {
    try {
      setGeneratingPDF(order.id);
      
      // Generate PDF
      generateOrderPDF(order);

      toast({
        title: "PDF Gerado",
        description: `O PDF do pedido ${order.id.substring(0, 8)} foi gerado com sucesso.`
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF para este pedido."
      });
    } finally {
      setGeneratingPDF(null);
    }
  };
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchTermLower) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTermLower)) ||
      order.address.street.toLowerCase().includes(searchTermLower) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchTermLower))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <OrderSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ordersCount={filteredOrders.length}
      />
      
      <OrdersTable 
        orders={filteredOrders}
        generatingPDF={generatingPDF}
        onGeneratePDF={handleGeneratePDF}
      />
    </div>
  );
};

export default OrderExports;
