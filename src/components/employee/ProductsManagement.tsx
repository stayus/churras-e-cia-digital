
import { useProductsManagement } from "./products/useProductsManagement";
import ProductSearch from "./products/ProductSearch";
import ProductBatchActions from "./products/ProductBatchActions";
import ProductsTable from "./products/ProductsTable";

const ProductsManagement = () => {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedProducts,
    filteredProducts,
    fetchProducts,
    toggleProductStock,
    updateSelectedProductsStock,
    handleProductSelection,
    handleSelectAll
  } = useProductsManagement();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <ProductSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          onRefresh={fetchProducts}
        />
        
        <ProductBatchActions
          selectedCount={selectedProducts.length}
          onMarkOutOfStock={() => updateSelectedProductsStock(true)}
          onMarkAvailable={() => updateSelectedProductsStock(false)}
        />
      </div>

      <ProductsTable
        products={filteredProducts}
        loading={loading}
        selectedProducts={selectedProducts}
        onToggleStock={toggleProductStock}
        onSelectProduct={handleProductSelection}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
};

export default ProductsManagement;
