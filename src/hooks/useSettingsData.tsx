
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SettingsData } from '@/types/settings';
import { 
  getDefaultWorkingHours, 
  getDefaultDeliveryTiers, 
  mapSettingsFromDb, 
  mapSettingsToDb 
} from '@/utils/settingsUtils';

export function useSettingsData() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // First check if any settings exist
      const { data: settingsExists, error: checkError } = await supabase
        .from('settings')
        .select('id')
        .limit(1);
      
      if (checkError) {
        throw checkError;
      }
      
      // If no settings exist, create default settings
      if (!settingsExists || settingsExists.length === 0) {
        const defaultWorkingHours = getDefaultWorkingHours();
        const defaultDeliveryTiers = getDefaultDeliveryTiers();
        
        const defaultSettings = {
          store_name: 'Churrasquinho & Cia',
          store_phone: '(00) 0000-0000',
          pix_key: '',
          whatsapp_link: 'https://wa.me/5500000000000',
          shipping_fee: 5.0,
          free_shipping_radius_km: 2.0,
          delivery_tiers: defaultDeliveryTiers,
          store_address: {
            street: '',
            number: '',
            city: '',
            zip: ''
          },
          working_hours: defaultWorkingHours
        };
        
        const { data: newSettings, error: createError } = await supabase
          .from('settings')
          .insert(defaultSettings)
          .select()
          .single();
          
        if (createError) {
          throw createError;
        }
        
        // Map the newly created settings to our app format
        if (newSettings) {
          setSettings(mapSettingsFromDb(newSettings));
        }
      } else {
        // Settings exist, fetch them
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .limit(1)
          .single();
          
        if (error) {
          throw error;
        }
        
        setSettings(mapSettingsFromDb(data));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading settings',
        description: 'Unable to load store settings.'
      });
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<SettingsData>) => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      // Prepare data for database format
      const updateData = mapSettingsToDb(newSettings);
      
      // Update settings in database
      const { error } = await supabase
        .from('settings')
        .update(updateData)
        .eq('id', settings.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state with new settings
      setSettings({
        ...settings,
        ...newSettings,
      });
      
      toast({
        title: 'Configurações atualizadas',
        description: 'As configurações foram salvas com sucesso.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar configurações',
        description: 'Ocorreu um erro ao salvar as configurações.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings
  };
}

// Re-export SettingsData interface for convenience
export type { SettingsData } from '@/types/settings';
