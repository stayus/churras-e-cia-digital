
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
        throw new Error('É necessário gerar uma senha para novos funcionários');
      }
      
      try {
        // Log the data being sent to the edge function
        const employeeData = {
          name: dbEmployee.name,
          username: dbEmployee.username,
          password: dbEmployee.password,
          cpf: dbEmployee.cpf || null,
          phone: dbEmployee.phone || null,
          birth_date: dbEmployee.birth_date || null,
          pix_key: dbEmployee.pix_key || null,
          role: dbEmployee.role,
          permissions: dbEmployee.permissions
        };
        
        console.log('Sending data to create-employee function:', employeeData);
        
        // Use direct URL with full project reference to avoid issues with redirects
        const projectRef = "flhdgdpewxooxtxqqhdz"; // From your Supabase config
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaGRnZHBld3hvb3h0eHFxaGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODc4ODgsImV4cCI6MjA2Mjc2Mzg4OH0.ZDT4JO3QQb1zlaD-NeMT0pcAJ-aNhDELNqyB3Gyl9no";
        
        // Make a direct fetch call to the edge function
        const response = await fetch(`https://${projectRef}.supabase.co/functions/v1/create-employee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'apikey': apiKey
          },
          body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response from create-employee function:', response.status, errorText);
          throw new Error(`Falha ao criar funcionário: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.success) {
          console.error('Failed to create employee:', data?.error || 'Unknown error');
          throw new Error(data?.error || 'Falha ao criar funcionário');
        }
        
        console.log('Employee created successfully:', data);
        return true;
      } catch (functionError: any) {
        // More specific error message for edge function failures
        console.error('Error with edge function:', functionError);
        if (functionError.message && functionError.message.includes('Failed to fetch')) {
          throw new Error('Erro de conexão com o servidor. Verifique sua conexão de internet e tente novamente.');
        } else {
          throw new Error(`Erro na função: ${functionError.message || 'Erro de conexão'}`);
        }
      }
    } else if (employee.id) {
      console.log('Updating employee:', employee.id);
      
      try {
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
          throw new Error(`Falha ao atualizar funcionário: ${error.message}`);
        }
        
        if (!data || !data.success) {
          console.error('Failed to update employee:', data?.error || 'Unknown error');
          throw new Error(data?.error || 'Falha ao atualizar funcionário');
        }
        
        console.log('Employee updated successfully:', data);
        return true;
      } catch (functionError: any) {
        console.error('Error with edge function:', functionError);
        if (functionError.message && functionError.message.includes('Failed to fetch')) {
          throw new Error('Erro de conexão com o servidor. Verifique sua conexão de internet e tente novamente.');
        } else {
          throw new Error(`Erro na função: ${functionError.message || 'Erro de conexão'}`);
        }
      }
    } else {
      throw new Error('Dados de funcionário inválidos');
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
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-employee', {
        body: { id: employeeId }
      });
      
      if (error) {
        console.error('Error calling delete-employee function:', error);
        throw new Error(`Failed to delete employee: ${error.message}`);
      }
      
      if (!data || !data.success) {
        console.error('Failed to delete employee:', data?.error || 'Unknown error');
        throw new Error(data?.error || 'Failed to delete employee');
      }
      
      console.log('Employee deleted successfully');
      return true;
    } catch (functionError: any) {
      console.error('Error with edge function:', functionError);
      if (functionError.message && functionError.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão com o servidor. Verifique sua conexão de internet e tente novamente.');
      } else {
        throw new Error(`Erro na função: ${functionError.message || 'Erro de conexão'}`);
      }
    }
  } catch (error) {
    console.error('Error removing employee:', error);
    throw error;
  }
}
