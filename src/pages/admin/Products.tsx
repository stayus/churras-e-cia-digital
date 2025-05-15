
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { PlusCircle } from "lucide-react";
import ProductFormDialog from "@/components/admin/products/ProductFormDialog";

const AdminProducts = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <BackButton to="/admin" label="Voltar ao Dashboard" />
      
      <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            onClick={() => setIsProductDialogOpen(true)}
          >
            <PlusCircle size={16} />
            Adicionar Novo Produto
          </Button>
          
          <p className="mt-4">A lista completa de produtos aparecerá aqui.</p>
        </CardContent>
      </Card>
      
      <ProductFormDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSubmit={(data) => {
          console.log("Product data:", data);
          // Will be implemented to save to Supabase
          setIsProductDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminProducts;
