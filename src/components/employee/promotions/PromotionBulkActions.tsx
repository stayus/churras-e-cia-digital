
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";

interface PromotionBulkActionsProps {
  selectedCount: number;
  discountPercent: number;
  onDiscountChange: (value: number) => void;
  onApplyBulk: () => void;
  onClearBulk: () => void;
}

const PromotionBulkActions = ({
  selectedCount,
  discountPercent,
  onDiscountChange,
  onApplyBulk,
  onClearBulk
}: PromotionBulkActionsProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex items-center border rounded-md px-3 max-w-xs">
        <Input 
          type="number"
          className="border-0 w-20"
          value={discountPercent}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
          min="1"
          max="99"
        />
        <Percent className="h-4 w-4 text-muted-foreground" />
      </div>
      <Button
        variant="default"
        onClick={onApplyBulk}
      >
        Aplicar desconto
      </Button>
      <Button
        variant="outline"
        onClick={onClearBulk}
      >
        Remover promoções
      </Button>
    </div>
  );
};

export default PromotionBulkActions;
