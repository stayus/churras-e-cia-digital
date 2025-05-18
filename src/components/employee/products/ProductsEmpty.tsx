
import { TableRow, TableCell } from "@/components/ui/table";

const ProductsEmpty = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        Nenhum produto encontrado.
      </TableCell>
    </TableRow>
  );
};

export default ProductsEmpty;
