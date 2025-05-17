
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { PlusCircle, Loader2 } from "lucide-react";
import ProductFormDialog from "@/components/admin/products/ProductFormDialog";
import ProductDebugger from "@/components/admin/products/ProductDebugger";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProducts, Product } from "@/hooks/useProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminProducts = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const { products, loading, fetchProducts } = useProducts();

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

  // Efetuar refresh dos produtos quando a página carrega
  useEffect(() => {
    console.log("AdminProducts montado - buscando produtos");
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>
        
        {/* Debugger de produtos */}
        <ProductDebugger />
        
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
