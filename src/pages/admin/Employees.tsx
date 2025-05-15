
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import EmployeeTable from '@/components/admin/employees/EmployeeTable';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import EmployeeDialog from '@/components/admin/employees/EmployeeDialog';
import { BackButton } from '@/components/ui/back-button';
import { toast } from '@/hooks/use-toast';

const AdminEmployees = () => {
  const {
    employees,
    isLoading,
    saveEmployee,
    deleteEmployee,
    generatePassword,
  } = useEmployeeData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);

  // Remove the useEffect that was causing the loop

  const handleOpenDialog = (employee: Employee | null = null) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleOpenDeleteDialog = (employee: Employee) => {
    // Don't allow removing the admin user
    if (employee.username === 'admin') {
      toast({
        variant: 'destructive',
        title: 'Operação não permitida',
        description: 'O usuário administrador não pode ser removido.'
      });
      return;
    }
    
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (employee: Partial<Employee>, isNew: boolean) => {
    console.log('Handling save employee:', { employee, isNew });
    const success = await saveEmployee(employee, isNew);
    if (success) {
      handleCloseDialog();
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    setIsDeletingEmployee(true);
    try {
      const success = await deleteEmployee(selectedEmployee.id);
      if (success) {
        toast({
          title: "Funcionário removido",
          description: `O funcionário ${selectedEmployee.name} foi removido com sucesso.`
        });
        handleCloseDeleteDialog();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover funcionário",
        description: error instanceof Error ? error.message : (error?.message || "Ocorreu um erro durante a remoção.")
      });
    } finally {
      setIsDeletingEmployee(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <BackButton to="/admin" label="Voltar ao Dashboard" />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Funcionários</h1>
          
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleOpenDialog()}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Funcionário
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
          title="Remover Funcionário"
          description={
            selectedEmployee 
              ? `Tem certeza que deseja remover o funcionário ${selectedEmployee.name}? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja remover este funcionário? Esta ação não pode ser desfeita."
          }
          confirmLabel={isDeletingEmployee ? "Removendo..." : "Sim, remover"}
          cancelLabel="Cancelar"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEmployees;
