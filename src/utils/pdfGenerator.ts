
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order, statusTextMap, formatPaymentMethod } from "@/types/orders";
import { formatCurrency } from "@/lib/format";

export const generateOrderPDF = (order: Order): void => {
  // Create PDF document
  const doc = new jsPDF();
  
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
};
