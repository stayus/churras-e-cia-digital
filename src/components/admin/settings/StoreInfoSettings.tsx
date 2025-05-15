
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StoreSettings } from '@/types/dashboard';

interface StoreInfoSettingsProps {
  settings: StoreSettings;
  onSave: (settings: Partial<StoreSettings>) => void;
}

const StoreInfoSettings: React.FC<StoreInfoSettingsProps> = ({ settings, onSave }) => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: settings.storeName,
    storePhone: settings.storePhone,
    pixKey: settings.pixKey,
    whatsappLink: settings.whatsappLink,
    storeAddress: {
      street: settings.storeAddress.street,
      number: settings.storeAddress.number,
      city: settings.storeAddress.city,
      zip: settings.storeAddress.zip,
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setStoreInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setStoreInfo(prev => ({
      ...prev,
      storeAddress: {
        ...prev.storeAddress,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        storeName: storeInfo.storeName,
        storePhone: storeInfo.storePhone,
        pixKey: storeInfo.pixKey,
        whatsappLink: storeInfo.whatsappLink,
        storeAddress: storeInfo.storeAddress
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="store-name">Nome da Loja</Label>
          <Input
            id="store-name"
            value={storeInfo.storeName}
            onChange={(e) => handleChange('storeName', e.target.value)}
            placeholder="Nome da sua loja"
          />
        </div>
        
        <div>
          <Label htmlFor="store-phone">Telefone</Label>
          <Input
            id="store-phone"
            value={storeInfo.storePhone}
            onChange={(e) => handleChange('storePhone', e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div>
          <Label htmlFor="pix-key">Chave PIX</Label>
          <Input
            id="pix-key"
            value={storeInfo.pixKey}
            onChange={(e) => handleChange('pixKey', e.target.value)}
            placeholder="Sua chave PIX para recebimentos"
          />
        </div>
        
        <div>
          <Label htmlFor="whatsapp-link">Link do WhatsApp</Label>
          <Input
            id="whatsapp-link"
            value={storeInfo.whatsappLink}
            onChange={(e) => handleChange('whatsappLink', e.target.value)}
            placeholder="https://wa.me/5500000000000"
          />
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Endereço da Loja</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={storeInfo.storeAddress.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Rua da loja"
              />
            </div>
            
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={storeInfo.storeAddress.number}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="123"
              />
            </div>
            
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={storeInfo.storeAddress.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="Cidade"
              />
            </div>
            
            <div>
              <Label htmlFor="zip">CEP</Label>
              <Input
                id="zip"
                value={storeInfo.storeAddress.zip}
                onChange={(e) => handleAddressChange('zip', e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={isSaving}
      >
        {isSaving ? 'Salvando...' : 'Salvar Informações'}
      </Button>
    </div>
  );
};

export default StoreInfoSettings;
