
import { useState, useEffect, useCallback } from 'react';
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

  // Use useCallback to prevent recreation of the function on each render
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching employees from database...');
      const formattedEmployees = await fetchEmployeesFromDatabase();
      console.log('Employees fetched successfully:', formattedEmployees);
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar funcionários',
        description: 'Não foi possível carregar a lista de funcionários.'
      });
      // Definir como array vazio em caso de erro
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveEmployee = async (employee: Partial<Employee>, isNew: boolean) => {
    console.log(`Saving employee (isNew: ${isNew}):`, employee);
    try {
      const success = await saveEmployeeToDatabase(employee, isNew);
      
      if (success) {
        toast({
          title: isNew ? 'Funcionário adicionado' : 'Funcionário atualizado',
          description: `Funcionário ${employee.name} foi ${isNew ? 'adicionado' : 'atualizado'} com sucesso.`
        });
        
        // Recarregar lista
        fetchEmployees();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar funcionário',
        description: error instanceof Error ? error.message : (error?.message || 'Ocorreu um erro ao salvar o funcionário.')
      });
      return false;
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      console.log('Deleting employee:', employeeId);
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
    } catch (error: any) {
      console.error('Error removing employee:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover funcionário',
        description: error instanceof Error ? error.message : (error?.message || 'Ocorreu um erro ao remover o funcionário.')
      });
      return false;
    }
  };

  // Carregar funcionários quando o componente é montado, apenas uma vez
  useEffect(() => {
    console.log('useEmployeeData: Initial data fetch');
    fetchEmployees();
    // Empty dependency array means this effect runs once on mount
  }, [fetchEmployees]);

  return {
    employees,
    isLoading,
    fetchEmployees,
    saveEmployee,
    deleteEmployee,
    generatePassword: generateSecurePassword
  };
}
