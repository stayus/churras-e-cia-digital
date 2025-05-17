
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { PlusCircle, Loader2 } from "lucide-react";
import ProductFormDialog from "@/components/admin/products/ProductFormDialog";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client"; 
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/hooks/useProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminProducts = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Buscando produtos...");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      console.log("Produtos encontrados:", data);
      setProducts(data as Product[]);
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar produtos',
        description: error.message || 'Não foi possível obter a lista de produtos.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos quando o componente montar
  useEffect(() => {
    fetchProducts();

    // Configurar escuta em tempo real para atualizações
    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Função para formatar preço como currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para lidar com o formulário de produto
  const handleProductSubmit = (data: any) => {
    console.log("Product data:", data);
    setIsProductDialogOpen(false);
    fetchProducts(); // Atualizar lista de produtos
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produtos</CardTitle>
            <Button 
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
              onClick={() => setIsProductDialogOpen(true)}
            >
              <PlusCircle size={16} />
              Adicionar Novo Produto
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">Carregando produtos...</span>
              </div>
            ) : products.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum produto cadastrado. Adicione seu primeiro produto!
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.is_out_of_stock
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.is_out_of_stock ? "Esgotado" : "Disponível"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <ProductFormDialog
          open={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}
          onSubmit={handleProductSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
