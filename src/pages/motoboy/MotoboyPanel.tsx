
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MotoboyPanel = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Painel do Motoboy</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Entregas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa do painel de motoboy será implementada em breve.</p>
          <p>Aqui você poderá visualizar entregas e atualizar seus status.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotoboyPanel;
