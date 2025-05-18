
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  originalPrice?: number;
  discountPercent: number;
  onDiscountChange: (value: number) => void;
  promotionPrice: number | null;
  onPromotionPriceChange: (value: number) => void;
  onApplyPromotion: () => void;
  formatCurrency: (value?: number) => string;
}

const PromotionDialog = ({
  open,
  onOpenChange,
  productName,
  originalPrice,
  discountPercent,
  onDiscountChange,
  promotionPrice,
  onPromotionPriceChange,
  onApplyPromotion,
  formatCurrency
}: PromotionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir preço promocional</DialogTitle>
          <DialogDescription>
            {productName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="original-price">Preço original:</Label>
            <Input
              id="original-price"
              value={originalPrice ? formatCurrency(originalPrice) : ""}
              readOnly
              disabled
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="discount">Desconto (%):</Label>
            <Input
              id="discount"
              type="number"
              value={discountPercent}
              onChange={(e) => onDiscountChange(Number(e.target.value))}
              min="1"
              max="99"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="promotion-price">Preço promocional:</Label>
            <Input
              id="promotion-price"
              value={promotionPrice !== null ? formatCurrency(promotionPrice).replace("R$", "") : ""}
              onChange={(e) => {
                // Clean input and parse as number
                const value = e.target.value.replace(/[^0-9,]/g, "").replace(",", ".");
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                  onPromotionPriceChange(numValue);
                }
              }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onApplyPromotion}>Aplicar promoção</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDialog;
