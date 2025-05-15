
import { DeliveryTier, WorkingHours } from './dashboard';
import { Json } from '@/integrations/supabase/types';

export interface SettingsData {
  id: string;
  storeName: string;
  storePhone: string;
  pixKey: string;
  whatsappLink: string;
  shippingFee: number;
  freeShippingRadiusKm: number;
  deliveryTiers?: DeliveryTier[];
  storeAddress: {
    street: string;
    number: string;
    city: string;
    zip: string;
  };
  workingHours: WorkingHours[];
}

export interface DbSettingsData {
  id: string;
  store_name: string;
  store_phone: string;
  pix_key: string;
  whatsapp_link: string;
  shipping_fee: number;
  free_shipping_radius_km: number;
  delivery_tiers?: Json;
  store_address?: Record<string, string>;
  working_hours?: Json;
}
