
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkingHoursSettings from './WorkingHoursSettings';
import StoreInfoSettings from './StoreInfoSettings';
import DeliverySettings from './DeliverySettings';
import { StoreSettings } from '@/types/dashboard';

interface SettingsTabsProps {
  isLoading: boolean;
  settings: StoreSettings;
  onUpdateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ 
  isLoading, 
  settings, 
  onUpdateSettings 
}) => {
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
            {!isLoading && (
              <WorkingHoursSettings 
                workingHours={settings.workingHours} 
                onSave={(workingHours) => onUpdateSettings({ workingHours })} 
              />
            )}
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
            {!isLoading && (
              <StoreInfoSettings
                settings={settings}
                onSave={(newSettings) => onUpdateSettings(newSettings)}
              />
            )}
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
            {!isLoading && (
              <DeliverySettings
                settings={settings}
                onSave={(newSettings) => onUpdateSettings(newSettings)}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
