
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Employee } from '@/types/dashboard';
import EmployeeForm from '@/components/admin/employees/EmployeeForm';

interface EmployeeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Partial<Employee>, isNew: boolean) => void;
  onCancel: () => void;
  generatePassword: () => string;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  onSave,
  onCancel,
  generatePassword
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Edit Employee' : 'Add Employee'}
          </DialogTitle>
        </DialogHeader>
        
        <EmployeeForm
          employee={employee}
          onSave={onSave}
          onCancel={onCancel}
          generatePassword={generatePassword}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
