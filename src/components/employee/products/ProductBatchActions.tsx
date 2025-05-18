
import { Button } from "@/components/ui/button";

interface ProductBatchActionsProps {
  selectedCount: number;
  onMarkOutOfStock: () => void;
  onMarkAvailable: () => void;
}

const ProductBatchActions = ({ 
  selectedCount, 
  onMarkOutOfStock, 
  onMarkAvailable 
}: ProductBatchActionsProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        onClick={onMarkOutOfStock}
      >
        Marcar como esgotados
      </Button>
      <Button
        variant="outline"
        onClick={onMarkAvailable}
      >
        Disponibilizar
      </Button>
    </div>
  );
};

export default ProductBatchActions;
