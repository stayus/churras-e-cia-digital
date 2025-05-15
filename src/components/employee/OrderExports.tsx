import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Download, CircleX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';

// Type declarations for orders
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  extras?: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  items: OrderItem[];
  total: number;
  status: 'received' | 'preparing' | 'delivering' | 'completed';
  payment_method: 'pix' | 'dinheiro' | 'cartao';
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    complement?: string;
  };
  created_at: string;
  observations?: string;
}

const statusTextMap = {
  received: "Pedido recebido",
  preparing: "Em produção",
  delivering: "Saiu para entrega",
  completed: "Pedido finalizado",
};

const OrderExports = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_id,
          items,
          total,
          status,
          payment_method,
          address,
          observations,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Fetch customer names for each order
      const ordersWithCustomerNames = await Promise.all(
        data.map(async (order) => {
          const { data: customerData } = await supabase
            .from("customers")
            .select("name")
            .eq("id", order.customer_id)
            .single();

          return {
            ...order,
            customer_name: customerData?.name || "Cliente não encontrado",
            // Convert items from Json to OrderItem[] type
            items: (typeof order.items === 'string' 
              ? JSON.parse(order.items) 
              : order.items) as OrderItem[]
          };
        })
      );

      setOrders(ordersWithCustomerNames as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pedidos",
        description: "Não foi possível obter a lista de pedidos.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF for order
  const generatePDF = (order: Order) => {
    try {
      setGeneratingPDF(order.id);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Format currency
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        }).format(value);
      };

      // Add header
      doc.setFontSize(18);
      doc.text("Churrasquinho & Cia - Pedido", 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Número do Pedido: #${order.id.substring(0, 8)}`, 14, 30);
      doc.text(`Data: ${format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 35);
      doc.text(`Status: ${statusTextMap[order.status]}`, 14, 40);
      
      // Customer information
      doc.setFontSize(14);
      doc.text("Informações do Cliente", 14, 50);
      doc.setFontSize(12);
      doc.text(`Nome: ${order.customer_name}`, 14, 55);
      
      // Delivery address
      doc.text("Endereço de Entrega:", 14, 65);
      doc.text(`${order.address.street}, ${order.address.number}${order.address.complement ? `, ${order.address.complement}` : ''}`, 14, 70);
      doc.text(`${order.address.neighborhood}, ${order.address.city}`, 14, 75);
      
      // Payment information
      doc.text(`Forma de Pagamento: ${formatPaymentMethod(order.payment_method)}`, 14, 85);
      
      // Order items
      doc.setFontSize(14);
      doc.text("Itens do Pedido", 14, 95);
      
      // Create items table
      const tableColumn = ["Item", "Qtd", "Preço Unit.", "Total"];
      const tableRows: any[][] = [];
      
      order.items.forEach((item) => {
        const itemName = item.productName;
        const itemData = [
          itemName,
          item.quantity,
          formatCurrency(item.price),
          formatCurrency(item.price * item.quantity)
        ];
        tableRows.push(itemData);
        
        // Add extras if any
        if (item.extras && item.extras.length > 0) {
          item.extras.forEach(extra => {
            tableRows.push([
              `  • ${extra.name}`,
              "",
              formatCurrency(extra.price),
              ""
            ]);
          });
        }
      });
      
      // Add the table to the document
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        styles: { fontSize: 10 },
        theme: 'grid'
      });
      
      // Add total after the table
      const finalY = (doc as any).lastAutoTable.finalY || 120;
      doc.text(`Total do Pedido: ${formatCurrency(order.total)}`, 14, finalY + 10);
      
      // Add observations if any
      if (order.observations) {
        doc.setFontSize(14);
        doc.text("Observações", 14, finalY + 20);
        doc.setFontSize(12);
        doc.text(order.observations, 14, finalY + 25);
      }
      
      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text("Churrasquinho & Cia - Obrigado pela Preferência!", 14, pageHeight - 10);
      
      // Save the PDF
      doc.save(`Pedido_${order.id.substring(0, 8)}.pdf`);

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

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Refresh orders when there's a change
          fetchOrders();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatPaymentMethod = (method: string) => {
    switch(method) {
      case 'pix': return 'PIX';
      case 'dinheiro': return 'Dinheiro';
      case 'cartao': return 'Cartão';
      default: return method;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Input
          className="w-full sm:w-72"
          placeholder="Pesquisar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="text-sm text-muted-foreground">
          Total: {filteredOrders.length} pedidos
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {statusTextMap[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    }).format(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generatePDF(order)}
                      disabled={generatingPDF === order.id}
                    >
                      {generatingPDF === order.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar PDF
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <CircleX className="h-8 w-8 mb-2" />
                    <p>Nenhum pedido encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderExports;
