
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusSelector } from "./StatusSelector";
import { Order, statusColorMap, statusTextMap, formatPaymentMethod } from "@/types/orders";

interface OrderDetailsProps {
  order: Order | null;
  statusOptions: { value: string; label: string }[];
  onUpdateStatus: (orderId: string, status: string) => void;
  onBack: () => void;
}

export const OrderDetails = ({
  order,
  statusOptions,
  onUpdateStatus,
  onBack,
}: OrderDetailsProps) => {
  if (!order) {
    return (
      <div className="flex justify-center items-center h-full rounded-lg border border-dashed p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Selecione um Pedido</h3>
          <p className="text-muted-foreground">
            Clique em um pedido à esquerda para ver os detalhes e gerenciar seu status
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Pedido #{order.id.substring(0, 8)}</CardTitle>
        <CardDescription>
          Criado em {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge className={statusColorMap[order.status]}>
            {statusTextMap[order.status]}
          </Badge>
          <Badge variant="outline">
            {formatPaymentMethod(order.payment_method)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Cliente</h3>
          <p>{order.customer_name}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Endereço de Entrega</h3>
          <p>
            {order.address.street}, {order.address.number}
            {order.address.complement && `, ${order.address.complement}`}
          </p>
          <p>{order.address.neighborhood}, {order.address.city}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Itens</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <div>
                  <p>
                    {item.quantity}x {item.productName}
                  </p>
                  {item.extras && item.extras.length > 0 && (
                    <ul className="text-sm text-muted-foreground">
                      {item.extras.map((extra, i) => (
                        <li key={i}>{extra.name} (+R$ {extra.price.toFixed(2)})</li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="font-medium">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {order.observations && (
          <div>
            <h3 className="font-medium mb-2">Observações</h3>
            <p className="text-muted-foreground">{order.observations}</p>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <p className="font-bold">Total</p>
          <p className="font-bold">R$ {order.total.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <p className="font-medium">Atualizar status:</p>
          <StatusSelector
            options={statusOptions}
            disabled={order.status === 'completed' || statusOptions.length === 0}
            onStatusChange={(value) => onUpdateStatus(order.id, value)}
          />
        </div>
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
      </CardFooter>
    </Card>
  );
};
