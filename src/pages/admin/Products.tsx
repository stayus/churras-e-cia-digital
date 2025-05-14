
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminProducts = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-red-600 hover:bg-red-700">
            Adicionar Novo Produto
          </Button>
          <p className="mt-4">A funcionalidade completa de gerenciamento de produtos será implementada em breve.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
