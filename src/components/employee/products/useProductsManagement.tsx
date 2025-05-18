
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOutOfStock: boolean;
  promotionPrice?: number;
}

export const useProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("ProductsManagement: Buscando produtos do banco de dados");
      
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, is_out_of_stock, promotion_price")
        .order("name");

      if (error) {
        throw error;
      }

      console.log("ProductsManagement: Produtos recebidos:", data);

      // Map database fields to client model
      const formattedProducts: Product[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
        isOutOfStock: item.is_out_of_stock,
        promotionPrice: item.promotion_price
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: "Não foi possível obter a lista de produtos."
      });
    } finally {
      setLoading(false);
    }
  };

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
          ? { ...product, isOutOfStock: !currentStatus } 
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
          ? { ...product, isOutOfStock: setAsOutOfStock } 
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

  useEffect(() => {
    console.log("ProductsManagement montado - buscando produtos");
    fetchProducts();
    
    // Set up a real-time subscription for products
    const subscription = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log("Alteração detectada na tabela products:", payload);
          fetchProducts(); // Refresh products when there's a change
        }
      )
      .subscribe();

    console.log('Escuta em tempo real configurada para a tabela products no ProductsManagement');

    return () => {
      console.log('Removendo escuta em tempo real do ProductsManagement');
      subscription.unsubscribe();
    };
  }, []);

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
