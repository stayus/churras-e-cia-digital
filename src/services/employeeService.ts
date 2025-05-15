
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/dashboard';
import { formatDatabaseToAppEmployee, formatAppToDatabaseEmployee, DatabaseEmployee } from '@/utils/employeeFormatters';

/**
 * Fetch employees from the database
 */
export async function fetchEmployeesFromDatabase(): Promise<Employee[]> {
  try {
    console.log('Starting to fetch employees from database...');
    
    // Use service role client via the edge function to bypass RLS
    const { data: response, error: functionError } = await supabase.functions.invoke('get-employees', {
      method: 'GET'
    });
    
    if (functionError) {
      console.error('Error calling get-employees function:', functionError);
      throw functionError;
    }
    
    if (!response || !response.data) {
      console.log('No employees found or invalid response format');
      return [];
    }
    
    console.log(`Found ${response.data.length} employees via edge function`);
    
    // Format database data to application format
    return response.data.map(employee => formatDatabaseToAppEmployee(employee));
  } catch (error) {
    console.error('Error in fetchEmployeesFromDatabase:', error);
    throw error;
  }
}

/**
 * Save an employee to the database
 */
export async function saveEmployeeToDatabase(employee: Partial<Employee>, isNew: boolean): Promise<boolean> {
  try {
    const dbEmployee = formatAppToDatabaseEmployee(employee, isNew);
    
    if (isNew) {
      // Para novos funcionários, usar a Edge Function create-employee
      console.log('Creating new employee:', dbEmployee);
      
      // Verificar se a senha foi fornecida
      if (!dbEmployee.password) {
        throw new Error('Password is required for new employees');
      }
      
      // Chamar a Edge Function para criar o funcionário
      const { data, error } = await supabase.functions.invoke('create-employee', {
        body: {
          name: dbEmployee.name,
          username: dbEmployee.username, 
          password: dbEmployee.password,
          cpf: dbEmployee.cpf || null,
          phone: dbEmployee.phone || null,
          birth_date: dbEmployee.birth_date || null,
          pix_key: dbEmployee.pix_key || null,
          role: dbEmployee.role,
          permissions: dbEmployee.permissions
        }
      });
      
      if (error) {
        console.error('Error calling create-employee function:', error);
        throw error;
      }
      
      if (!data.success) {
        console.error('Failed to create employee:', data.error);
        throw new Error(data.error || 'Failed to create employee');
      }
      
      console.log('Employee created successfully:', data);
      return true;
    } else if (employee.id) {
      console.log('Updating employee:', employee.id);
      
      const { data, error } = await supabase.functions.invoke('update-employee', {
        body: {
          id: employee.id,
          name: dbEmployee.name,
          username: dbEmployee.username,
          cpf: dbEmployee.cpf,
          phone: dbEmployee.phone,
          birth_date: dbEmployee.birth_date,
          pix_key: dbEmployee.pix_key,
          role: dbEmployee.role,
          permissions: dbEmployee.permissions
        }
      });
      
      if (error) {
        console.error('Error calling update-employee function:', error);
        throw error;
      }
      
      if (!data.success) {
        console.error('Failed to update employee:', data.error);
        throw new Error(data.error || 'Failed to update employee');
      }
      
      console.log('Employee updated successfully:', data);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving employee:', error);
    throw error;
  }
}

/**
 * Delete an employee from the database
 */
export async function deleteEmployeeFromDatabase(employeeId: string): Promise<boolean> {
  try {
    console.log('Deleting employee:', employeeId);
    
    const { data, error } = await supabase.functions.invoke('delete-employee', {
      body: { id: employeeId }
    });
    
    if (error) {
      console.error('Error calling delete-employee function:', error);
      throw error;
    }
    
    if (!data.success) {
      console.error('Failed to delete employee:', data.error);
      throw new Error(data.error || 'Failed to delete employee');
    }
    
    console.log('Employee deleted successfully');
    return true;
  } catch (error) {
    console.error('Error removing employee:', error);
    throw error;
  }
}
