
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import PromotionTableRow from "./PromotionTableRow";
import ProductsLoading from "../products/ProductsLoading";
import ProductsEmpty from "../products/ProductsEmpty";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isOutOfStock: boolean;
  promotionPrice?: number;
}

interface PromotionsTableProps {
  products: Product[];
  loading: boolean;
  selectedProducts: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectProduct: (productId: string, checked: boolean) => void;
  onOpenPromotion: (product: Product) => void;
  onRemovePromotion: (productId: string) => void;
  formatCurrency: (value?: number) => string;
}

const PromotionsTable = ({
  products,
  loading,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onOpenPromotion,
  onRemovePromotion,
  formatCurrency
}: PromotionsTableProps) => {
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
            <TableHead>Preço normal</TableHead>
            <TableHead>Preço promocional</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <ProductsLoading />
          ) : products.length > 0 ? (
            products.map((product) => (
              <PromotionTableRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onToggleSelection={(checked) => onSelectProduct(product.id, checked)}
                onOpenPromotion={() => onOpenPromotion(product)}
                onRemovePromotion={() => onRemovePromotion(product.id)}
                formatCurrency={formatCurrency}
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

export default PromotionsTable;
