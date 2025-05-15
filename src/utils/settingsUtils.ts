
import { DeliveryTier, WorkingHours } from '@/types/dashboard';
import { DbSettingsData, SettingsData } from '@/types/settings';
import { Json } from '@/integrations/supabase/types';

export const getDefaultWorkingHours = (): WorkingHours[] => {
  return Array.from({ length: 7 }, (_, index) => ({
    id: `day-${index}`,
    dayOfWeek: index,
    openTime: '09:00',
    closeTime: '18:00',
    isOpen: index !== 0 // Closed on Sundays (day 0)
  }));
};

export const getDefaultDeliveryTiers = (baseFee: number = 5.0): DeliveryTier[] => {
  return [
    { id: 'tier-1', minDistance: 0, maxDistance: 3, fee: baseFee }
  ];
};

export const mapSettingsFromDb = (data: DbSettingsData): SettingsData => {
  // Cast properly from database to our application type
  const workingHoursData = data.working_hours as unknown as WorkingHours[] || [];
  const storeAddressData = data.store_address as unknown as Record<string, string> || {};
  const deliveryTiersData = data.delivery_tiers as unknown as DeliveryTier[] || 
    getDefaultDeliveryTiers(data.shipping_fee);
  
  return {
    id: data.id,
    storeName: data.store_name,
    storePhone: data.store_phone,
    pixKey: data.pix_key,
    whatsappLink: data.whatsapp_link,
    shippingFee: data.shipping_fee,
    freeShippingRadiusKm: data.free_shipping_radius_km,
    deliveryTiers: deliveryTiersData,
    storeAddress: {
      street: storeAddressData.street || '',
      number: storeAddressData.number || '',
      city: storeAddressData.city || '',
      zip: storeAddressData.zip || ''
    },
    workingHours: workingHoursData
  };
};

export const mapSettingsToDb = (settings: Partial<SettingsData>): Partial<DbSettingsData> => {
  const updateData: Partial<DbSettingsData> = {};
  
  if (settings.storeName !== undefined) 
    updateData.store_name = settings.storeName;
  
  if (settings.storePhone !== undefined) 
    updateData.store_phone = settings.storePhone;
  
  if (settings.pixKey !== undefined) 
    updateData.pix_key = settings.pixKey;
  
  if (settings.whatsappLink !== undefined) 
    updateData.whatsapp_link = settings.whatsappLink;
  
  if (settings.shippingFee !== undefined) 
    updateData.shipping_fee = settings.shippingFee;
  
  if (settings.freeShippingRadiusKm !== undefined) 
    updateData.free_shipping_radius_km = settings.freeShippingRadiusKm;
  
  if (settings.storeAddress !== undefined) 
    updateData.store_address = settings.storeAddress as unknown as Json;
  
  if (settings.workingHours !== undefined) 
    updateData.working_hours = settings.workingHours as unknown as Json;
    
  if (settings.deliveryTiers !== undefined)
    updateData.delivery_tiers = settings.deliveryTiers as unknown as Json;
    
  return updateData;
};
