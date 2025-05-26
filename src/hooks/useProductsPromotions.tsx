import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export const useProductsPromotions = () => {
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [loading, setLoading] = useState(productsLoading);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promotionPrice, setPromotionPrice] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Sincronizar com produtos do hook global
  useEffect(() => {
    if (!productsLoading) {
      setProducts(allProducts);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [allProducts, productsLoading]);

  // Apply promotion to a product
  const applyPromotion = async () => {
    try {
      if (!currentProduct || promotionPrice === null) {
        return;
      }
      
      const { error } = await supabase
        .from("products")
        .update({ promotion_price: promotionPrice })
        .eq("id", currentProduct.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(products.map(product => 
        product.id === currentProduct.id 
          ? { ...product, promotion_price: promotionPrice } 
          : product
      ));

      toast({
        title: "Promoção aplicada",
        description: `Preço promocional de ${formatCurrency(promotionPrice)} aplicado para ${currentProduct.name}`
      });

      // Reset states
      setDialogOpen(false);
      setCurrentProduct(null);
      setPromotionPrice(null);
      setDiscountPercent(10);
    } catch (error) {
      console.error("Error applying promotion:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aplicar promoção",
        description: "Não foi possível atualizar o preço promocional do produto."
      });
    }
  };

  // Remove promotion from a product
  const removePromotion = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ promotion_price: null })
        .eq("id", productId);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, promotion_price: null } 
          : product
      ));

      toast({
        title: "Promoção removida",
        description: `Preço promocional removido com sucesso`
      });
    } catch (error) {
      console.error("Error removing promotion:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover promoção",
        description: "Não foi possível remover o preço promocional do produto."
      });
    }
  };

  // Apply promotion to multiple products
  const applyBulkPromotion = async () => {
    try {
      if (selectedProducts.length === 0 || discountPercent <= 0) {
        toast({
          variant: "destructive",
          title: "Seleção inválida",
          description: "Selecione produtos e informe um desconto válido"
        });
        return;
      }

      // Calculate promotional prices for each product
      const updates = selectedProducts.map(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;
        
        const newPrice = Number((product.price * (1 - discountPercent / 100)).toFixed(2));
        
        return {
          id: productId,
          promotion_price: newPrice
        };
      }).filter(Boolean);

      // Update each product individually
      for (const update of updates) {
        if (!update) continue;
        
        const { error } = await supabase
          .from("products")
          .update({ promotion_price: update.promotion_price })
          .eq("id", update.id);

        if (error) throw error;
      }

      // Update local state
      const updatedProducts = products.map(product => {
        if (selectedProducts.includes(product.id)) {
          const newPrice = Number((product.price * (1 - discountPercent / 100)).toFixed(2));
          return { ...product, promotion_price: newPrice };
        }
        return product;
      });

      setProducts(updatedProducts);

      toast({
        title: "Promoções aplicadas",
        description: `Desconto de ${discountPercent}% aplicado a ${selectedProducts.length} produtos`
      });

      // Clear selections
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error applying bulk promotion:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aplicar promoções",
        description: "Não foi possível atualizar os preços promocionais."
      });
    }
  };

  // Clear promotions from multiple products
  const clearBulkPromotions = async () => {
    try {
      if (selectedProducts.length === 0) {
        toast({
          variant: "destructive",
          title: "Nenhum produto selecionado",
          description: "Selecione pelo menos um produto para remover promoções."
        });
        return;
      }

      const { error } = await supabase
        .from("products")
        .update({ promotion_price: null })
        .in("id", selectedProducts);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(products.map(product => 
        selectedProducts.includes(product.id) 
          ? { ...product, promotion_price: null } 
          : product
      ));

      toast({
        title: "Promoções removidas",
        description: `Preços promocionais removidos de ${selectedProducts.length} produtos`
      });

      // Clear selections
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error clearing promotions:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover promoções",
        description: "Não foi possível remover os preços promocionais."
      });
    }
  };

  // Handle product selection
  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Handle "Select All" functionality
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const filteredProductIds = filteredProducts.map(product => product.id);
      setSelectedProducts(filteredProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  // Open promotion dialog for a specific product
  const openPromotionDialog = (product: Product) => {
    setCurrentProduct(product);
    // Set initial discount to 10% or calculate from existing promotion
    if (product.promotion_price) {
      const calculatedDiscount = Math.round((1 - product.promotion_price / product.price) * 100);
      setDiscountPercent(calculatedDiscount);
      setPromotionPrice(product.promotion_price);
    } else {
      setDiscountPercent(10);
      setPromotionPrice(Number((product.price * 0.9).toFixed(2)));
    }
    setDialogOpen(true);
  };

  // Format currency values
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update promotion price when discount percent changes
  useEffect(() => {
    if (currentProduct && discountPercent >= 0 && discountPercent <= 100) {
      const newPrice = Number((currentProduct.price * (1 - discountPercent / 100)).toFixed(2));
      setPromotionPrice(newPrice);
    }
  }, [discountPercent, currentProduct]);

  return {
    products: filteredProducts,
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
  };
};
