
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettings = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa de configurações será implementada em breve.</p>
          <p>Aqui você poderá configurar a chave pix, taxa de frete, raio de frete grátis e dados da loja.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
