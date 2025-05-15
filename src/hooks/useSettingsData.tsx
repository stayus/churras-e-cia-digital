
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkingHours } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';

export interface SettingsData {
  id: string;
  storeName: string;
  storePhone: string;
  pixKey: string;
  whatsappLink: string;
  shippingFee: number;
  freeShippingRadiusKm: number;
  storeAddress: {
    street: string;
    number: string;
    city: string;
    zip: string;
  };
  workingHours: WorkingHours[];
}

export function useSettingsData() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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
      
      // Cast properly from database to our application type
      const workingHoursData = data.working_hours as unknown as WorkingHours[] || [];
      const storeAddressData = data.store_address as Record<string, string> || {};
      
      setSettings({
        id: data.id,
        storeName: data.store_name,
        storePhone: data.store_phone,
        pixKey: data.pix_key,
        whatsappLink: data.whatsapp_link,
        shippingFee: data.shipping_fee,
        freeShippingRadiusKm: data.free_shipping_radius_km,
        storeAddress: {
          street: storeAddressData.street || '',
          number: storeAddressData.number || '',
          city: storeAddressData.city || '',
          zip: storeAddressData.zip || ''
        },
        workingHours: workingHoursData
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading settings',
        description: 'Unable to load store settings.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: SettingsData) => {
    setIsSaving(true);
    try {
      // Convert workingHours to a safe JSON format for Supabase
      const workingHoursForDb = newSettings.workingHours as unknown as Json;
      
      const { error } = await supabase
        .from('settings')
        .update({
          store_name: newSettings.storeName,
          store_phone: newSettings.storePhone,
          pix_key: newSettings.pixKey,
          whatsapp_link: newSettings.whatsappLink,
          shipping_fee: newSettings.shippingFee,
          free_shipping_radius_km: newSettings.freeShippingRadiusKm,
          store_address: newSettings.storeAddress,
          working_hours: workingHoursForDb
        })
        .eq('id', newSettings.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Settings updated',
        description: 'Store settings were successfully updated.'
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving settings',
        description: 'An error occurred while saving the settings.'
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
