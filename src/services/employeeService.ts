
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/dashboard';
import { formatDatabaseToAppEmployee, formatAppToDatabaseEmployee, DatabaseEmployee } from '@/utils/employeeFormatters';

/**
 * Fetch employees from the database
 */
export async function fetchEmployeesFromDatabase(): Promise<Employee[]> {
  // Usar service role key (via edge function) para evitar problemas de RLS
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.log('No employees found in database');
    return [];
  }
  
  console.log(`Found ${data.length} employees in database`);
  
  // Format database data to application format
  return data.map(employee => formatDatabaseToAppEmployee(employee));
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
      // Atualizar funcionário existente - usando a tabela direta
      const { error } = await supabase
        .from('employees')
        .update({
          name: dbEmployee.name,
          username: dbEmployee.username,
          cpf: dbEmployee.cpf,
          phone: dbEmployee.phone,
          birth_date: dbEmployee.birth_date,
          pix_key: dbEmployee.pix_key,
          role: dbEmployee.role,
          permissions: dbEmployee.permissions
        })
        .eq('id', employee.id);
        
      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
      
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
      console.error('Error deleting employee:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing employee:', error);
    throw error;
  }
}
