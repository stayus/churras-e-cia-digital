
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import EmployeeTable from '@/components/admin/employees/EmployeeTable';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import EmployeeDialog from '@/components/admin/employees/EmployeeDialog';

const AdminEmployees = () => {
  const {
    employees,
    isLoading,
    saveEmployee,
    deleteEmployee,
    generatePassword
  } = useEmployeeData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleOpenDialog = (employee: Employee | null = null) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleOpenDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (employee: Partial<Employee>, isNew: boolean) => {
    const success = await saveEmployee(employee, isNew);
    if (success) {
      handleCloseDialog();
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    const success = await deleteEmployee(selectedEmployee.id);
    if (success) {
      handleCloseDeleteDialog();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Employees</h1>
          
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleOpenDialog()}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
        
        <EmployeeTable 
          employees={employees}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onDelete={handleOpenDeleteDialog}
        />
        
        <EmployeeDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          onCancel={handleCloseDialog}
          generatePassword={generatePassword}
        />
        
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteEmployee}
          title="Remove Employee"
          description={`Are you sure you want to remove employee ${selectedEmployee?.name}? This action cannot be undone.`}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEmployees;
