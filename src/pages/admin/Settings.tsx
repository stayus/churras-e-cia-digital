
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoreSettings, WorkingHours } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WorkingHoursSettings from '@/components/admin/settings/WorkingHoursSettings';
import StoreInfoSettings from '@/components/admin/settings/StoreInfoSettings';
import DeliverySettings from '@/components/admin/settings/DeliverySettings';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<StoreSettings>({
    workingHours: [],
    pixKey: '',
    shippingFee: 0,
    freeShippingRadiusKm: 0,
    storeName: '',
    storePhone: '',
    storeAddress: {
      street: '',
      number: '',
      city: '',
      zip: ''
    },
    whatsappLink: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();
          
        if (error) {
          throw error;
        }
        
        // Configura os horários de funcionamento
        const workingHours: WorkingHours[] = data.working_hours as WorkingHours[] || [];
        
        // Certifica-se de que temos entradas para todos os dias da semana
        const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        const existingDays = workingHours.map(h => h.dayOfWeek);
        
        // Adiciona dias faltantes
        daysOfWeek.forEach(day => {
          if (!existingDays.includes(day)) {
            workingHours.push({
              id: `day-${day}`,
              dayOfWeek: day,
              openTime: '09:00',
              closeTime: '18:00',
              isOpen: day !== 0 // Fechado aos domingos por padrão
            });
          }
        });
        
        // Ordena por dia da semana
        workingHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
        
        // Converte o objeto store_address para o formato esperado
        const storeAddress = typeof data.store_address === 'object' ? data.store_address : {
          street: '',
          number: '',
          city: '',
          zip: ''
        };
        
        setSettings({
          workingHours,
          pixKey: data.pix_key || '',
          shippingFee: data.shipping_fee || 0,
          freeShippingRadiusKm: data.free_shipping_radius_km || 0,
          storeName: data.store_name || '',
          storePhone: data.store_phone || '',
          storeAddress,
          whatsappLink: data.whatsapp_link || ''
        });
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar configurações',
          description: 'Não foi possível carregar as configurações da loja.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Adapta para o formato do banco de dados
      const dbSettings: any = {};
      
      if (newSettings.workingHours) {
        dbSettings.working_hours = newSettings.workingHours;
      }
      
      if (newSettings.pixKey !== undefined) {
        dbSettings.pix_key = newSettings.pixKey;
      }
      
      if (newSettings.shippingFee !== undefined) {
        dbSettings.shipping_fee = newSettings.shippingFee;
      }
      
      if (newSettings.freeShippingRadiusKm !== undefined) {
        dbSettings.free_shipping_radius_km = newSettings.freeShippingRadiusKm;
      }
      
      if (newSettings.storeName !== undefined) {
        dbSettings.store_name = newSettings.storeName;
      }
      
      if (newSettings.storePhone !== undefined) {
        dbSettings.store_phone = newSettings.storePhone;
      }
      
      if (newSettings.storeAddress !== undefined) {
        dbSettings.store_address = newSettings.storeAddress;
      }
      
      if (newSettings.whatsappLink !== undefined) {
        dbSettings.whatsapp_link = newSettings.whatsappLink;
      }
      
      // Atualiza no banco
      const { error } = await supabase
        .from('settings')
        .update(dbSettings)
        .eq('id', '1'); // Assume que temos apenas um registro de configurações
        
      if (error) {
        throw error;
      }
      
      // Atualiza o estado local
      setSettings(updatedSettings);
      
      toast({
        title: 'Configurações atualizadas',
        description: 'As configurações da loja foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar configurações',
        description: 'Não foi possível salvar as alterações.'
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações da Loja</h1>
        
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
                    onSave={(workingHours) => updateSettings({ workingHours })} 
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
                    onSave={(newSettings) => updateSettings(newSettings)}
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
                    onSave={(newSettings) => updateSettings(newSettings)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
