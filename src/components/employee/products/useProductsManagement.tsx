
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProducts, Product } from "@/hooks/useProducts";

export const useProductsManagement = () => {
  const { products: allProducts, loading: productsLoading, fetchProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  // Sincronizar com produtos do hook global
  useEffect(() => {
    console.log("ProductsManagement: sincronizando produtos", allProducts);
    if (!productsLoading) {
      // Usando os produtos do hook global diretamente sem adaptação adicional
      setProducts(allProducts);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [allProducts, productsLoading]);

  // Toggle stock status for a single product
  const toggleProductStock = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_out_of_stock: !currentStatus })
        .eq("id", productId);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, is_out_of_stock: !currentStatus } 
          : product
      ));

      toast({
        title: "Estoque atualizado",
        description: `Produto ${!currentStatus ? 'marcado como esgotado' : 'disponível novamente'}`
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o status de estoque do produto."
      });
    }
  };

  // Update stock status for multiple selected products
  const updateSelectedProductsStock = async (setAsOutOfStock: boolean) => {
    try {
      if (selectedProducts.length === 0) {
        toast({
          variant: "destructive",
          title: "Nenhum produto selecionado",
          description: "Selecione pelo menos um produto para atualizar."
        });
        return;
      }

      const { error } = await supabase
        .from("products")
        .update({ is_out_of_stock: setAsOutOfStock })
        .in("id", selectedProducts);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(products.map(product => 
        selectedProducts.includes(product.id) 
          ? { ...product, is_out_of_stock: setAsOutOfStock } 
          : product
      ));

      toast({
        title: "Produtos atualizados",
        description: `${selectedProducts.length} produtos ${setAsOutOfStock ? 'marcados como esgotados' : 'disponíveis novamente'}`
      });

      // Clear selections
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error updating products stock:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar produtos",
        description: "Não foi possível atualizar o status de estoque dos produtos selecionados."
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

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
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
  };
};
