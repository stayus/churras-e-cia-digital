import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";
import { Product } from "@/types/product";

interface PromotionTableRowProps {
  product: Product;
  isSelected: boolean;
  onToggleSelection: (checked: boolean) => void;
  onOpenPromotion: () => void;
  onRemovePromotion: () => void;
  formatCurrency: (value?: number) => string;
}

const PromotionTableRow = ({
  product,
  isSelected,
  onToggleSelection,
  onOpenPromotion,
  onRemovePromotion,
  formatCurrency
}: PromotionTableRowProps) => {
  const discountPercent = product.promotion_price 
    ? Math.round((1 - product.promotion_price / product.price) * 100)
    : 0;

  return (
    <TableRow key={product.id} className={product.is_out_of_stock ? "bg-gray-50" : ""}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => 
            onToggleSelection(checked === true)
          }
          aria-label={`Select ${product.name}`}
          disabled={product.is_out_of_stock}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span>{product.name}</span>
            {product.is_out_of_stock && (
              <Badge variant="outline" className="text-xs">Esgotado</Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate max-w-md">
            {product.description}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {formatCurrency(product.price)}
      </TableCell>
      <TableCell className={product.promotion_price ? "text-green-600 font-medium" : ""}>
        {product.promotion_price ? formatCurrency(product.promotion_price) : "-"}
      </TableCell>
      <TableCell>
        {product.promotion_price ? (
          <Badge variant="secondary" className="flex items-center">
            {discountPercent}% <Percent className="h-3 w-3 ml-1" />
          </Badge>
        ) : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant={product.promotion_price ? "outline" : "default"}
            onClick={onOpenPromotion}
            disabled={product.is_out_of_stock}
          >
            {product.promotion_price ? "Editar" : "Adicionar"}
          </Button>
          {product.promotion_price && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={onRemovePromotion}
            >
              Remover
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PromotionTableRow;
