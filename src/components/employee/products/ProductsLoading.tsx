
import { Loader2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

const ProductsLoading = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24">
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
          <span>Carregando produtos...</span>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductsLoading;
