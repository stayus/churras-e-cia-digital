
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types/dashboard';

export function useEmployeeData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      
      // Format database data to application format
      const formattedEmployees: Employee[] = data.map(employee => {
        // Ensure permissions are properly typed
        const permissions = employee.permissions as Record<string, boolean> || {};
        
        return {
          id: employee.id,
          name: employee.name,
          username: employee.username,
          role: employee.role as 'admin' | 'employee' | 'motoboy',
          registrationNumber: employee.registration_number,
          cpf: employee.cpf,
          birthDate: employee.birth_date,
          phone: employee.phone,
          pixKey: employee.pix_key,
          permissions: {
            manageStock: permissions.manageStock || false,
            viewReports: permissions.viewReports || false,
            changeOrderStatus: permissions.changeOrderStatus || false,
            exportOrderReportPDF: permissions.exportOrderReportPDF || false,
            promotionProducts: permissions.promotionProducts || false
          }
        };
      });
      
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar funcionários',
        description: 'Não foi possível carregar a lista de funcionários.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmployee = async (employee: Partial<Employee>, isNew: boolean) => {
    try {
      // Format data for the database
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
      
      if (isNew) {
        // Add registration number for new employees
        dbEmployee.registration_number = `MC-${Math.floor(1000 + Math.random() * 9000)}`;
        dbEmployee.password = employee.password;
        
        // Insert new employee
        const { error } = await supabase
          .from('employees')
          .insert([dbEmployee]);
          
        if (error) {
          if (error.code === '23505') {
            toast({
              variant: 'destructive',
              title: 'Erro ao adicionar funcionário',
              description: 'O nome de usuário já existe. Por favor, escolha outro.'
            });
          } else {
            throw error;
          }
          return false;
        }
        
        toast({
          title: 'Funcionário adicionado',
          description: `Funcionário ${employee.name} foi adicionado com sucesso.`
        });
      } else if (employee.id) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update(dbEmployee)
          .eq('id', employee.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Funcionário atualizado',
          description: `Funcionário ${employee.name} foi atualizado com sucesso.`
        });
      }
      
      // Reload list
      fetchEmployees();
      return true;
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar funcionário',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o funcionário.'
      });
      return false;
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      // Check if employee is admin
      const { data } = await supabase
        .from('employees')
        .select('username')
        .eq('id', employeeId)
        .single();
        
      if (data && data.username === 'admin') {
        toast({
          variant: 'destructive',
          title: 'Operação não permitida',
          description: 'O usuário administrador não pode ser removido.'
        });
        return false;
      }
      
      // Delete employee
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Funcionário removido',
        description: 'O funcionário foi removido com sucesso.'
      });
      
      fetchEmployees();
      return true;
    } catch (error) {
      console.error('Error removing employee:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover funcionário',
        description: 'Ocorreu um erro ao remover o funcionário.'
      });
      return false;
    }
  };

  // Generate a random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const length = 8;
    let password = "";
    
    // Ensure at least one character of each type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "!@#$%^&*()"[Math.floor(Math.random() * 10)]; // Special
    
    // Fill the rest
    for (let i = 4; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    fetchEmployees,
    saveEmployee,
    deleteEmployee,
    generatePassword
  };
}
