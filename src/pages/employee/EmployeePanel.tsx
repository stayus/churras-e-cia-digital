
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeePanel = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Painel do Funcionário</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa do painel de funcionários será implementada em breve.</p>
          <p>Aqui você poderá visualizar pedidos e atualizar seus status.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeePanel;
