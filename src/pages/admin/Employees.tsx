
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmployeeForm from '@/components/admin/employees/EmployeeForm';
import EmployeeTable from '@/components/admin/employees/EmployeeTable';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      // Adaptar formato do banco para o formato da aplicação
      const formattedEmployees: Employee[] = data.map(employee => ({
        id: employee.id,
        name: employee.name,
        username: employee.username,
        role: employee.role,
        registrationNumber: employee.registration_number,
        cpf: employee.cpf,
        birthDate: employee.birth_date,
        phone: employee.phone,
        pixKey: employee.pix_key,
        permissions: {
          manageStock: employee.permissions?.manageStock || false,
          viewReports: employee.permissions?.viewReports || false,
          changeOrderStatus: employee.permissions?.changeOrderStatus || false,
          exportOrderReportPDF: employee.permissions?.exportOrderReportPDF || false,
          promotionProducts: employee.permissions?.promotionProducts || false
        }
      }));
      
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar funcionários',
        description: 'Não foi possível carregar a lista de funcionários.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [toast]);

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
    try {
      if (isNew) {
        // Cria um novo funcionário usando a função edge
        const { data, error } = await supabase.functions.invoke('create-employee', {
          body: {
            name: employee.name,
            username: employee.username,
            cpf: employee.cpf,
            phone: employee.phone,
            birth_date: employee.birthDate,
            pix_key: employee.pixKey,
            role: employee.role,
            password: employee.password || generatePassword(), // Gera senha se não fornecida
            permissions: employee.permissions,
          },
        });
        
        if (error || !data.success) {
          throw new Error(data?.error || 'Erro ao criar funcionário');
        }
        
        toast({
          title: 'Funcionário adicionado',
          description: `Funcionário ${employee.name} foi adicionado com sucesso.`
        });
      } else if (selectedEmployee) {
        // Adapta para o formato do banco
        const dbEmployee: any = {
          name: employee.name,
          username: employee.username,
          cpf: employee.cpf,
          phone: employee.phone,
          birth_date: employee.birthDate,
          pix_key: employee.pixKey,
          role: employee.role,
          permissions: employee.permissions,
        };
        
        // Atualiza funcionário existente
        const { error } = await supabase
          .from('employees')
          .update(dbEmployee)
          .eq('id', selectedEmployee.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Funcionário atualizado',
          description: `Funcionário ${employee.name} foi atualizado com sucesso.`
        });
      }
      
      // Recarrega lista
      fetchEmployees();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar funcionário',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o funcionário.'
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', selectedEmployee.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Funcionário removido',
        description: `Funcionário ${selectedEmployee.name} foi removido com sucesso.`
      });
      
      fetchEmployees();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Erro ao remover funcionário:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover funcionário',
        description: 'Ocorreu um erro ao remover o funcionário.'
      });
    }
  };

  // Função para gerar uma senha aleatória de 8 caracteres
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const length = 8;
    let password = "";
    
    // Garante pelo menos um caractere de cada tipo
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Maiúscula
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Minúscula
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Número
    password += "!@#$%^&*()"[Math.floor(Math.random() * 10)]; // Especial
    
    // Preenche o resto
    for (let i = 4; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Embaralha a senha
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  return (
    <AdminLayout>
      <div className="p-6">
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
              </DialogTitle>
            </DialogHeader>
            
            <EmployeeForm
              employee={selectedEmployee}
              onSave={handleSaveEmployee}
              onCancel={handleCloseDialog}
              generatePassword={generatePassword}
            />
          </DialogContent>
        </Dialog>
        
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteEmployee}
          title="Remover Funcionário"
          description={`Tem certeza que deseja remover o funcionário ${selectedEmployee?.name}? Esta ação não pode ser desfeita.`}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEmployees;
