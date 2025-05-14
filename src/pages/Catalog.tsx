
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CatalogPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Nossos Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>O catálogo completo de produtos será implementado em breve.</p>
          <p>Aqui você poderá ver todos os produtos disponíveis e adicioná-los ao carrinho.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogPage;
