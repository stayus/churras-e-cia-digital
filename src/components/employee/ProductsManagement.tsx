
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOutOfStock: boolean;
  promotionPrice?: number;
}

const ProductsManagement = () => {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Input
          className="w-full sm:w-72"
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchProducts}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          
          {selectedProducts.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => updateSelectedProductsStock(true)}
              >
                Marcar como esgotados
              </Button>
              <Button
                variant="outline"
                onClick={() => updateSelectedProductsStock(false)}
              >
                Disponibilizar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    filteredProducts.length > 0 && 
                    selectedProducts.length === filteredProducts.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="w-24">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
                    <span>Carregando produtos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => 
                        handleProductSelection(product.id, checked === true)
                      }
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-md">
                        {product.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    }).format(product.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isOutOfStock
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.isOutOfStock ? "Esgotado" : "Disponível"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Toggle
                      aria-label={
                        product.isOutOfStock
                          ? "Marcar como disponível"
                          : "Marcar como esgotado"
                      }
                      pressed={product.isOutOfStock}
                      onPressedChange={() => toggleProductStock(product.id, product.isOutOfStock)}
                    >
                      {product.isOutOfStock ? "Disponível?" : "Esgotar?"}
                    </Toggle>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsManagement;
