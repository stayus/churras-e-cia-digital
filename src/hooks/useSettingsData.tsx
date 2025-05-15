
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoreSettings, WorkingHours } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

export const useSettingsData = () => {
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
        
        // Configure working hours
        const workingHours: WorkingHours[] = data.working_hours as WorkingHours[] || [];
        
        // Make sure we have entries for all days of the week
        const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        const existingDays = workingHours.map(h => h.dayOfWeek);
        
        // Add missing days
        daysOfWeek.forEach(day => {
          if (!existingDays.includes(day)) {
            workingHours.push({
              id: `day-${day}`,
              dayOfWeek: day,
              openTime: '09:00',
              closeTime: '18:00',
              isOpen: day !== 0 // Closed on Sundays by default
            });
          }
        });
        
        // Sort by day of week
        workingHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
        
        // Convert store_address object to expected format
        const storeAddress = typeof data.store_address === 'object' ? {
          street: data.store_address.street || '',
          number: data.store_address.number || '',
          city: data.store_address.city || '',
          zip: data.store_address.zip || ''
        } : {
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

    fetchSettings();
  }, [toast]);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Adapt to database format
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
      
      // Update in database
      const { error } = await supabase
        .from('settings')
        .update(dbSettings)
        .eq('id', '1'); // Assuming we have only one settings record
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSettings(updatedSettings);
      
      toast({
        title: 'Settings updated',
        description: 'Store settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving settings',
        description: 'Unable to save changes.'
      });
    }
  };

  return {
    settings,
    isLoading,
    updateSettings
  };
};
