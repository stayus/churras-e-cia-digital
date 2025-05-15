
import React from 'react';
import { Employee } from '@/types/dashboard';
import EmployeeBasicInfo from './form/EmployeeBasicInfo';
import EmployeePermissions from './form/EmployeePermissions';
import PasswordGenerator from './form/PasswordGenerator';
import FormButtons from './form/FormButtons';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';

interface EmployeeFormProps {
  employee: Employee | null;
  onSave: (employee: Partial<Employee>, isNew: boolean) => void;
  onCancel: () => void;
  generatePassword: () => string;
  isSaving?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSave, 
  onCancel,
  generatePassword,
  isSaving = false
}) => {
  const {
    formData,
    isNew,
    password,
    setPassword,
    isSubmitting,
    handleChange,
    handlePermissionChange,
    handleSubmit
  } = useEmployeeForm(employee, onSave);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <EmployeeBasicInfo 
        formData={formData} 
        handleChange={handleChange} 
        isNew={isNew} 
      />
      
      {isNew && (
        <PasswordGenerator 
          password={password}
          setPassword={setPassword}
          generatePassword={generatePassword}
        />
      )}
      
      <EmployeePermissions 
        permissions={formData.permissions || {
          manageStock: false,
          viewReports: false,
          changeOrderStatus: false,
          exportOrderReportPDF: false,
          promotionProducts: false
        }}
        handlePermissionChange={handlePermissionChange}
      />
      
      <FormButtons 
        onCancel={onCancel}
        isSubmitting={isSubmitting || isSaving}
        isNew={isNew}
      />
    </form>
  );
};

export default EmployeeForm;
