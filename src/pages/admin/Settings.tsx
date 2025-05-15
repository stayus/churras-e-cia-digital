
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsTabs from '@/components/admin/settings/SettingsTabs';
import { BackButton } from '@/components/ui/back-button';
import { useSettingsData } from '@/hooks/useSettingsData';

const AdminSettings = () => {
  const { settings, isLoading, updateSettings } = useSettingsData();

  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <SettingsTabs 
          isLoading={isLoading} 
          settings={settings} 
          onUpdateSettings={updateSettings}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
