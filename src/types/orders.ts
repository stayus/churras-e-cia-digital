
export interface OrderItem {
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

export interface Order {
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

export const statusTextMap = {
  received: "Pedido recebido",
  preparing: "Em produção",
  delivering: "Saiu para entrega",
  completed: "Pedido finalizado",
};

export const statusColorMap = {
  received: "bg-blue-500",
  preparing: "bg-yellow-500",
  delivering: "bg-purple-500",
  completed: "bg-green-500",
};

export const formatPaymentMethod = (method: string) => {
  switch(method) {
    case 'pix': return 'PIX';
    case 'dinheiro': return 'Dinheiro';
    case 'cartao': return 'Cartão';
    default: return method;
  }
};

// Calculate total items in an order
export const calculateTotalItems = (items: OrderItem[]) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};
