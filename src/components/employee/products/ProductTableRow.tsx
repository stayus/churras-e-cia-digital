
import { Toggle } from "@/components/ui/toggle";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";
import { Product } from "@/hooks/useProducts";

interface ProductTableRowProps {
  product: Product;
  isSelected: boolean;
  onToggleSelection: (checked: boolean) => void;
  onToggleStock: () => void;
}

const ProductTableRow = ({ 
  product, 
  isSelected,
  onToggleSelection, 
  onToggleStock 
}: ProductTableRowProps) => {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => 
            onToggleSelection(checked === true)
          }
          aria-label={`Select ${product.name}`}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{product.name}</span>
          <span className="text-sm text-muted-foreground truncate max-w-md">
            {product.description}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        }).format(product.price)}
      </TableCell>
      <TableCell className="text-right">
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.is_out_of_stock
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {product.is_out_of_stock ? "Esgotado" : "Disponível"}
        </span>
      </TableCell>
      <TableCell>
        <Toggle
          aria-label={
            product.is_out_of_stock
              ? "Marcar como disponível"
              : "Marcar como esgotado"
          }
          pressed={product.is_out_of_stock}
          onPressedChange={onToggleStock}
        >
          {product.is_out_of_stock ? "Disponível?" : "Esgotar?"}
        </Toggle>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
