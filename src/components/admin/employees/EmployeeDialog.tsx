
import React from 'react';
import { Employee } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EmployeeForm from './EmployeeForm';

interface EmployeeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Partial<Employee>, isNew: boolean) => void;
  onCancel: () => void;
  generatePassword: () => string;
  isSaving?: boolean;
}

export default function EmployeeDialog({
  isOpen,
  onOpenChange,
  employee,
  onSave,
  onCancel,
  generatePassword,
  isSaving = false
}: EmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
          </DialogTitle>
        </DialogHeader>
        
        <EmployeeForm 
          employee={employee} 
          onSave={onSave} 
          onCancel={onCancel} 
          generatePassword={generatePassword}
          isSaving={isSaving}
        />
      </DialogContent>
    </Dialog>
  );
}
