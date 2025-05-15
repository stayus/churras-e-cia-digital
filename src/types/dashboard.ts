
export interface DashboardStats {
  dailyRevenue: number;
  totalOrders: number;
  canceledOrders: number;
  paymentMethods: {
    pix: number;
    cartao: number;
    dinheiro: number;
  };
}

export interface WorkingHours {
  id: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  openTime: string; // Formato: "HH:MM"
  closeTime: string; // Formato: "HH:MM"
  isOpen: boolean;
}

export interface StoreSettings {
  workingHours: WorkingHours[];
  pixKey: string;
  shippingFee: number;
  freeShippingRadiusKm: number;
  storeName: string;
  storePhone: string;
  storeAddress: {
    street: string;
    number: string;
    city: string;
    zip: string;
  };
  whatsappLink: string;
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'employee' | 'motoboy';
  registrationNumber: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  pixKey?: string;
  password?: string;  // Adicionado para permitir definir senha durante criação
  permissions: {
    manageStock: boolean;
    viewReports: boolean;
    changeOrderStatus: boolean;
    exportOrderReportPDF: boolean;
    promotionProducts: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOutOfStock: boolean;
  promotionPrice?: number;
  extras?: ProductExtra[];
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface SalesReport {
  periodStart: string;
  periodEnd: string;
  cardSales: number;
  pixSales: number;
  cashSales: number;
  productsSold: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  totalRevenue: number;
}
