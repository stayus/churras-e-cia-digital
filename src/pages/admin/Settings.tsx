
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BackButton } from '@/components/ui/back-button';
import { useSettingsData } from '@/hooks/useSettingsData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeliverySettings from '@/components/admin/settings/DeliverySettings';

const AdminSettings = () => {
  const { settings, isLoading, saveSettings } = useSettingsData();

  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <h1 className="text-3xl font-bold mb-6">Frete</h1>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : !settings ? (
          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Erro ao carregar configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">Não foi possível carregar as configurações de frete.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Frete</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliverySettings 
                settings={settings} 
                onSave={saveSettings} 
              />
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
