
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Download, CircleX } from "lucide-react";
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
import { Order, statusTextMap } from "@/types/orders";

interface OrdersTableProps {
  orders: Order[];
  generatingPDF: string | null;
  onGeneratePDF: (order: Order) => void;
}

export const OrdersTable = ({ orders, generatingPDF, onGeneratePDF }: OrdersTableProps) => {
  if (orders.length === 0) {
    return (
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
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <CircleX className="h-8 w-8 mb-2" />
                  <p>Nenhum pedido encontrado.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
          {orders.map((order) => (
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
                  onClick={() => onGeneratePDF(order)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
