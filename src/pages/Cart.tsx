
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CartPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Seu Carrinho</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa do carrinho será implementada em breve.</p>
          <p>Aqui você poderá ver os produtos que adicionou ao carrinho e finalizar sua compra.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage;
