
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminReports = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A funcionalidade completa de relatórios será implementada em breve.</p>
          <p>Aqui você poderá filtrar vendas por período, produto, total e status.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
