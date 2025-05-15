
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

  // Combined disabled state from both internal and parent component
  const isFormDisabled = isSubmitting || isSaving;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <EmployeeBasicInfo 
        formData={formData} 
        handleChange={handleChange} 
        isNew={isNew} 
        disabled={isFormDisabled}
      />
      
      {isNew && (
        <PasswordGenerator 
          password={password}
          setPassword={setPassword}
          generatePassword={generatePassword}
          disabled={isFormDisabled}
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
        disabled={isFormDisabled}
      />
      
      <FormButtons 
        onCancel={onCancel}
        isSubmitting={isFormDisabled}
        isNew={isNew}
      />
    </form>
  );
};

export default EmployeeForm;
