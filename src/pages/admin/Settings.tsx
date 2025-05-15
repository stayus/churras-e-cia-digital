
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsTabs from '@/components/admin/settings/SettingsTabs';
import { useSettingsData } from '@/hooks/useSettingsData';

const AdminSettings = () => {
  const { settings, isLoading, saveSettings } = useSettingsData();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações da Loja</h1>
        <SettingsTabs 
          isLoading={isLoading}
          settings={settings}
          onUpdateSettings={saveSettings}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
