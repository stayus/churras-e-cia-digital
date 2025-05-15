
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { BackButton } from '@/components/ui/back-button';

const AdminOrders = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="preparing">Em preparo</TabsTrigger>
            <TabsTrigger value="delivery">Em entrega</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card className="p-4">
              <div>Não há pedidos pendentes no momento.</div>
            </Card>
          </TabsContent>
          
          <TabsContent value="preparing">
            <Card className="p-4">
              <div>Não há pedidos em preparo no momento.</div>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivery">
            <Card className="p-4">
              <div>Não há pedidos em entrega no momento.</div>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card className="p-4">
              <div>Não há pedidos concluídos no momento.</div>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancelled">
            <Card className="p-4">
              <div>Não há pedidos cancelados no momento.</div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
