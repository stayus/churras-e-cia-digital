
import { useState } from "react";
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import ProductTableRow from "./ProductTableRow";
import ProductsLoading from "./ProductsLoading";
import ProductsEmpty from "./ProductsEmpty";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOutOfStock: boolean;
  promotionPrice?: number;
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  selectedProducts: string[];
  onToggleStock: (productId: string, currentStatus: boolean) => void;
  onSelectProduct: (productId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const ProductsTable = ({
  products,
  loading,
  selectedProducts,
  onToggleStock,
  onSelectProduct,
  onSelectAll
}: ProductsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  products.length > 0 && 
                  selectedProducts.length === products.length
                }
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="w-24">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <ProductsLoading />
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onToggleSelection={(checked) => onSelectProduct(product.id, checked)}
                onToggleStock={() => onToggleStock(product.id, product.isOutOfStock)}
              />
            ))
          ) : (
            <ProductsEmpty />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
