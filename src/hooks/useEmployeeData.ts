
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
        title: 'Error loading employees',
        description: 'Unable to load the employee list.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmployee = async (employee: Partial<Employee>, isNew: boolean) => {
    try {
      if (isNew) {
        // Create new employee using the edge function
        const { data, error } = await supabase.functions.invoke('create-employee', {
          body: {
            name: employee.name,
            username: employee.username,
            cpf: employee.cpf,
            phone: employee.phone,
            birth_date: employee.birthDate,
            pix_key: employee.pixKey,
            role: employee.role,
            password: employee.password,
            permissions: employee.permissions,
          },
        });
        
        if (error || !data.success) {
          throw new Error(data?.error || 'Error creating employee');
        }
        
        toast({
          title: 'Employee added',
          description: `Employee ${employee.name} was successfully added.`
        });
      } else if (employee.id) {
        // Format for database
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
        
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update(dbEmployee)
          .eq('id', employee.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Employee updated',
          description: `Employee ${employee.name} was successfully updated.`
        });
      }
      
      // Reload list
      fetchEmployees();
      return true;
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving employee',
        description: error instanceof Error ? error.message : 'An error occurred while saving the employee.'
      });
      return false;
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Employee removed',
        description: 'Employee was successfully removed.'
      });
      
      fetchEmployees();
      return true;
    } catch (error) {
      console.error('Error removing employee:', error);
      toast({
        variant: 'destructive',
        title: 'Error removing employee',
        description: 'An error occurred while removing the employee.'
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
