
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/dashboard';
import { formatDatabaseToAppEmployee, formatAppToDatabaseEmployee, DatabaseEmployee } from '@/utils/employeeFormatters';

/**
 * Fetch employees from the database
 */
export async function fetchEmployeesFromDatabase(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');
    
  if (error) {
    throw error;
  }
  
  // Format database data to application format
  return data.map(employee => formatDatabaseToAppEmployee(employee));
}

/**
 * Save an employee to the database
 */
export async function saveEmployeeToDatabase(employee: Partial<Employee>, isNew: boolean): Promise<boolean> {
  try {
    const dbEmployee: DatabaseEmployee = formatAppToDatabaseEmployee(employee, isNew);
    
    if (isNew) {
      // Insert new employee
      const { error } = await supabase
        .from('employees')
        .insert(dbEmployee);
        
      if (error) {
        if (error.code === '23505') {
          throw new Error('O nome de usuário já existe. Por favor, escolha outro.');
        } else {
          throw error;
        }
      }
    } else if (employee.id) {
      // Update existing employee
      const { error } = await supabase
        .from('employees')
        .update(dbEmployee)
        .eq('id', employee.id);
        
      if (error) {
        throw error;
      }
    }
    
    return true;
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
    // Check if employee is admin
    const { data } = await supabase
      .from('employees')
      .select('username')
      .eq('id', employeeId)
      .single();
      
    if (data && data.username === 'admin') {
      throw new Error('O usuário administrador não pode ser removido.');
    }
    
    // Delete employee
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing employee:', error);
    throw error;
  }
}
