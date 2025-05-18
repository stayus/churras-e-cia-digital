
import { Loader2 } from "lucide-react";
import { useProductsPromotions } from "@/hooks/useProductsPromotions";
import PromotionSearch from "./promotions/PromotionSearch";
import PromotionBulkActions from "./promotions/PromotionBulkActions";
import PromotionsTable from "./promotions/PromotionsTable";
import PromotionDialog from "./promotions/PromotionDialog";

const ProductsPromotions = () => {
  const {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    selectedProducts,
    handleProductSelection,
    handleSelectAll,
    discountPercent,
    setDiscountPercent,
    dialogOpen,
    setDialogOpen,
    currentProduct,
    promotionPrice,
    setPromotionPrice,
    applyPromotion,
    removePromotion,
    applyBulkPromotion,
    clearBulkPromotions,
    openPromotionDialog,
    formatCurrency,
  } = useProductsPromotions();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando produtos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <PromotionSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <PromotionBulkActions
          selectedCount={selectedProducts.length}
          discountPercent={discountPercent}
          onDiscountChange={setDiscountPercent}
          onApplyBulk={applyBulkPromotion}
          onClearBulk={clearBulkPromotions}
        />
      </div>

      <PromotionsTable
        products={products}
        loading={loading}
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleProductSelection}
        onOpenPromotion={openPromotionDialog}
        onRemovePromotion={removePromotion}
        formatCurrency={formatCurrency}
      />

      <PromotionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productName={currentProduct?.name}
        originalPrice={currentProduct?.price}
        discountPercent={discountPercent}
        onDiscountChange={setDiscountPercent}
        promotionPrice={promotionPrice}
        onPromotionPriceChange={(price) => {
          setPromotionPrice(price);
          if (currentProduct) {
            const newDiscount = Math.round((1 - price / currentProduct.price) * 100);
            if (newDiscount >= 0 && newDiscount <= 100) {
              setDiscountPercent(newDiscount);
            }
          }
        }}
        onApplyPromotion={applyPromotion}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default ProductsPromotions;
