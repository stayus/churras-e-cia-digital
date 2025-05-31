
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { PlusCircle, Loader2, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import ProductFormDialog from "@/components/admin/products/ProductFormDialog";
import ProductEditDialog from "@/components/admin/products/ProductEditDialog";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import ProductDebugger from "@/components/admin/products/ProductDebugger";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProducts, Product } from "@/hooks/useProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminProducts = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading, error, fetchProducts, deleteProduct, toggleProductStock } = useProducts();

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

  // Função para editar produto
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  // Função para atualizar produto
  const handleProductUpdate = (data: Product) => {
    console.log("Product updated:", data);
    setIsEditDialogOpen(false);
    fetchProducts(); // Atualizar lista de produtos
  };

  // Função para confirmar exclusão
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Função para excluir produto
  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      const success = await deleteProduct(selectedProduct.id);
      if (success) {
        fetchProducts();
      }
    }
    setIsDeleteDialogOpen(false);
  };

  // Função para alternar status de estoque
  const handleToggleStock = async (product: Product) => {
    await toggleProductStock(product.id, !product.is_out_of_stock);
  };

  // Efetuar refresh dos produtos quando a página carrega
  useEffect(() => {
    console.log("AdminProducts montado - buscando produtos");
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 mr-2" />
            <span className="text-gray-700">Carregando produtos...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
              <p className="text-red-600 mb-6 text-lg">Erro ao carregar produtos:</p>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={fetchProducts}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Gerenciar Produtos</h1>
        
        {/* Debugger de produtos */}
        <ProductDebugger />
        
        <Card className="mb-6 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900">Produtos</CardTitle>
            <Button 
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2 text-white"
              onClick={() => setIsProductDialogOpen(true)}
            >
              <PlusCircle size={16} />
              Adicionar Novo Produto
            </Button>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-center py-8 text-gray-600">
                Nenhum produto cadastrado. Adicione seu primeiro produto!
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">Nome</TableHead>
                      <TableHead className="text-gray-700">Descrição</TableHead>
                      <TableHead className="text-gray-700">Preço</TableHead>
                      <TableHead className="text-gray-700">Categoria</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-right text-gray-700">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                        <TableCell className="max-w-xs truncate text-gray-700">{product.description}</TableCell>
                        <TableCell className="text-gray-900">{formatCurrency(product.price)}</TableCell>
                        <TableCell className="text-gray-700 capitalize">{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.is_out_of_stock
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {product.is_out_of_stock ? "Esgotado" : "Disponível"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStock(product)}
                              className="p-1 h-8 w-8"
                            >
                              {product.is_out_of_stock ? (
                                <ToggleLeft className="h-4 w-4 text-red-600" />
                              ) : (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
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

        {selectedProduct && (
          <ProductEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSubmit={handleProductUpdate}
            product={selectedProduct}
          />
        )}

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Excluir Produto"
          description={`Tem certeza que deseja excluir o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
