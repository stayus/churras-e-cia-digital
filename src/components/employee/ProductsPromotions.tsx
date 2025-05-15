
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Percent } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOutOfStock: boolean;
  promotionPrice?: number;
}

const ProductsPromotions = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [promotionPrice, setPromotionPrice] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, is_out_of_stock, promotion_price")
        .order("name");

      if (error) {
        throw error;
      }

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
          ? { ...product, promotionPrice } 
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
          ? { ...product, promotionPrice: undefined } 
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
          return { ...product, promotionPrice: newPrice };
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
          ? { ...product, promotionPrice: undefined } 
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

  useEffect(() => {
    fetchProducts();
    
    // Set up a real-time subscription for products
    const subscription = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts(); // Refresh products when there's a change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update promotion price when discount percent changes
  useEffect(() => {
    if (currentProduct && discountPercent >= 0 && discountPercent <= 100) {
      const newPrice = Number((currentProduct.price * (1 - discountPercent / 100)).toFixed(2));
      setPromotionPrice(newPrice);
    }
  }, [discountPercent, currentProduct]);

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
    if (product.promotionPrice) {
      const calculatedDiscount = Math.round((1 - product.promotionPrice / product.price) * 100);
      setDiscountPercent(calculatedDiscount);
      setPromotionPrice(product.promotionPrice);
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
        <Input
          className="w-full sm:w-72"
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          {selectedProducts.length > 0 && (
            <>
              <div className="flex items-center border rounded-md px-3 max-w-xs">
                <Input 
                  type="number"
                  className="border-0 w-20"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  min="1"
                  max="99"
                />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                variant="default"
                onClick={applyBulkPromotion}
              >
                Aplicar desconto
              </Button>
              <Button
                variant="outline"
                onClick={clearBulkPromotions}
              >
                Remover promoções
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
              <TableHead>Preço normal</TableHead>
              <TableHead>Preço promocional</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const discountPercent = product.promotionPrice 
                  ? Math.round((1 - product.promotionPrice / product.price) * 100)
                  : 0;
                  
                return (
                  <TableRow key={product.id} className={product.isOutOfStock ? "bg-gray-50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => 
                          handleProductSelection(product.id, checked === true)
                        }
                        aria-label={`Select ${product.name}`}
                        disabled={product.isOutOfStock}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span>{product.name}</span>
                          {product.isOutOfStock && (
                            <Badge variant="outline" className="text-xs">Esgotado</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground truncate max-w-md">
                          {product.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className={product.promotionPrice ? "text-green-600 font-medium" : ""}>
                      {product.promotionPrice ? formatCurrency(product.promotionPrice) : "-"}
                    </TableCell>
                    <TableCell>
                      {product.promotionPrice ? (
                        <Badge variant="secondary" className="flex items-center">
                          {discountPercent}% <Percent className="h-3 w-3 ml-1" />
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={product.promotionPrice ? "outline" : "default"}
                          onClick={() => openPromotionDialog(product)}
                          disabled={product.isOutOfStock}
                        >
                          {product.promotionPrice ? "Editar" : "Adicionar"}
                        </Button>
                        {product.promotionPrice && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => removePromotion(product.id)}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir preço promocional</DialogTitle>
            <DialogDescription>
              {currentProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="original-price">Preço original:</Label>
              <Input
                id="original-price"
                value={currentProduct?.price ? formatCurrency(currentProduct.price) : ""}
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
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
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
                    setPromotionPrice(numValue);
                    if (currentProduct) {
                      const newDiscount = Math.round((1 - numValue / currentProduct.price) * 100);
                      if (newDiscount >= 0 && newDiscount <= 100) {
                        setDiscountPercent(newDiscount);
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={applyPromotion}>Aplicar promoção</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPromotions;
