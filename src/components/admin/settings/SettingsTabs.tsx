
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkingHoursSettings from './WorkingHoursSettings';
import StoreInfoSettings from './StoreInfoSettings';
import DeliverySettings from './DeliverySettings';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsData } from '@/hooks/useSettingsData';

interface SettingsTabsProps {
  isLoading: boolean;
  settings: SettingsData | null;
  onUpdateSettings: (settings: Partial<SettingsData>) => Promise<void>;
}

// Helper component to display while loading
const SettingsLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

const SettingsTabs: React.FC<SettingsTabsProps> = ({ 
  isLoading, 
  settings, 
  onUpdateSettings 
}) => {
  // Make sure settings is not null before accessing its properties
  if (isLoading || !settings) {
    return (
      <Tabs defaultValue="working-hours">
        <TabsList className="mb-4">
          <TabsTrigger value="working-hours">Horários de Funcionamento</TabsTrigger>
          <TabsTrigger value="store-info">Informações da Loja</TabsTrigger>
          <TabsTrigger value="delivery">Entrega</TabsTrigger>
        </TabsList>
        
        <TabsContent value="working-hours">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários em que a loja estará aberta para pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsLoader />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="store-info">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>
                Configurações gerais e informações de contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsLoader />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Entrega</CardTitle>
              <CardDescription>
                Configure taxas de entrega e raio de entrega gratuita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsLoader />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }
  
  return (
    <Tabs defaultValue="working-hours">
      <TabsList className="mb-4">
        <TabsTrigger value="working-hours">Horários de Funcionamento</TabsTrigger>
        <TabsTrigger value="store-info">Informações da Loja</TabsTrigger>
        <TabsTrigger value="delivery">Entrega</TabsTrigger>
      </TabsList>
      
      <TabsContent value="working-hours">
        <Card>
          <CardHeader>
            <CardTitle>Horários de Funcionamento</CardTitle>
            <CardDescription>
              Configure os horários em que a loja estará aberta para pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkingHoursSettings 
              workingHours={settings.workingHours || []} 
              onSave={(workingHours) => onUpdateSettings({ workingHours })} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="store-info">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Loja</CardTitle>
            <CardDescription>
              Configurações gerais e informações de contato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreInfoSettings
              settings={settings}
              onSave={(newSettings) => onUpdateSettings(newSettings)}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="delivery">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Entrega</CardTitle>
            <CardDescription>
              Configure taxas de entrega e raio de entrega gratuita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliverySettings
              settings={settings}
              onSave={(newSettings) => onUpdateSettings(newSettings)}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
