
import React from "react";
import { Input } from "@/components/ui/input";

interface OrderSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  ordersCount: number;
}

export const OrderSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  ordersCount 
}: OrderSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <Input
        className="w-full sm:w-72"
        placeholder="Pesquisar pedidos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="text-sm text-muted-foreground">
        Total: {ordersCount} pedidos
      </div>
    </div>
  );
};
