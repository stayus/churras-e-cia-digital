
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types/dashboard';
import { 
  fetchEmployeesFromDatabase, 
  saveEmployeeToDatabase, 
  deleteEmployeeFromDatabase 
} from '@/services/employeeService';
import { generateSecurePassword } from '@/utils/employeeFormatters';

export function useEmployeeData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const formattedEmployees = await fetchEmployeesFromDatabase();
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
      const success = await saveEmployeeToDatabase(employee, isNew);
      
      if (success) {
        toast({
          title: isNew ? 'Funcionário adicionado' : 'Funcionário atualizado',
          description: `Funcionário ${employee.name} foi ${isNew ? 'adicionado' : 'atualizado'} com sucesso.`
        });
        
        // Reload list
        fetchEmployees();
        return true;
      }
      return false;
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
      const success = await deleteEmployeeFromDatabase(employeeId);
      
      if (success) {
        toast({
          title: 'Funcionário removido',
          description: 'O funcionário foi removido com sucesso.'
        });
        
        fetchEmployees();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing employee:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover funcionário',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao remover o funcionário.'
      });
      return false;
    }
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
    generatePassword: generateSecurePassword
  };
}
