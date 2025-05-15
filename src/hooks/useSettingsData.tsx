
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
        const defaultSettings = {
          store_name: 'Churrasquinho & Cia',
          store_phone: '(00) 0000-0000',
          pix_key: '',
          whatsapp_link: 'https://wa.me/5500000000000',
          shipping_fee: 5.0,
          free_shipping_radius_km: 2.0,
          store_address: {
            street: '',
            number: '',
            city: '',
            zip: ''
          },
          working_hours: getDefaultWorkingHours()
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
          mapSettingsFromDb(newSettings);
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
        
        mapSettingsFromDb(data);
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
  
  // Helper function to map database settings to our app format
  const mapSettingsFromDb = (data: any) => {
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
  };
  
  // Create default working hours for all days of the week
  const getDefaultWorkingHours = (): WorkingHours[] => {
    return Array.from({ length: 7 }, (_, index) => ({
      id: `day-${index}`,
      dayOfWeek: index,
      openTime: '09:00',
      closeTime: '18:00',
      isOpen: index !== 0 // Closed on Sundays (day 0)
    }));
  };

  const saveSettings = async (newSettings: Partial<SettingsData>) => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      // Prepare data for database format
      const updateData: any = {};
      
      if (newSettings.storeName !== undefined) 
        updateData.store_name = newSettings.storeName;
      
      if (newSettings.storePhone !== undefined) 
        updateData.store_phone = newSettings.storePhone;
      
      if (newSettings.pixKey !== undefined) 
        updateData.pix_key = newSettings.pixKey;
      
      if (newSettings.whatsappLink !== undefined) 
        updateData.whatsapp_link = newSettings.whatsappLink;
      
      if (newSettings.shippingFee !== undefined) 
        updateData.shipping_fee = newSettings.shippingFee;
      
      if (newSettings.freeShippingRadiusKm !== undefined) 
        updateData.free_shipping_radius_km = newSettings.freeShippingRadiusKm;
      
      if (newSettings.storeAddress !== undefined) 
        updateData.store_address = newSettings.storeAddress;
      
      if (newSettings.workingHours !== undefined) 
        updateData.working_hours = newSettings.workingHours;
      
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
        title: 'Settings updated',
        description: 'Store settings were successfully updated.'
      });
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
