
import { Employee } from '@/types/dashboard';
import { Json } from '@/integrations/supabase/types';

// Type for the database employee format
export type DatabaseEmployee = {
  name: string;
  username: string;
  password?: string;
  cpf?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  pix_key?: string | null;
  role: string;
  permissions: Json;
  registration_number?: string;
};

/**
 * Convert database employee data to application format
 */
export function formatDatabaseToAppEmployee(dbEmployee: any): Employee {
  // Ensure permissions are properly typed
  const permissions = dbEmployee.permissions as Record<string, boolean> || {};
  
  return {
    id: dbEmployee.id,
    name: dbEmployee.name,
    username: dbEmployee.username,
    role: dbEmployee.role as 'admin' | 'employee' | 'motoboy',
    registrationNumber: dbEmployee.registration_number,
    cpf: dbEmployee.cpf,
    birthDate: dbEmployee.birth_date,
    phone: dbEmployee.phone,
    pixKey: dbEmployee.pix_key,
    permissions: {
      manageStock: permissions.manageStock || false,
      viewReports: permissions.viewReports || false,
      changeOrderStatus: permissions.changeOrderStatus || false,
      exportOrderReportPDF: permissions.exportOrderReportPDF || false,
      promotionProducts: permissions.promotionProducts || false
    }
  };
}

/**
 * Convert application employee data to database format
 */
export function formatAppToDatabaseEmployee(employee: Partial<Employee>, isNew: boolean = false): DatabaseEmployee {
  const dbEmployee: DatabaseEmployee = {
    name: employee.name || '',
    username: employee.username || '',
    role: employee.role || 'employee',
    permissions: employee.permissions || {
      manageStock: false,
      viewReports: false,
      changeOrderStatus: false,
      exportOrderReportPDF: false,
      promotionProducts: false
    },
    cpf: employee.cpf,
    phone: employee.phone,
    birth_date: employee.birthDate,
    pix_key: employee.pixKey,
  };
  
  if (isNew) {
    // Add registration number for new employees
    dbEmployee.registration_number = `MC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Note: We're not setting the password here because we want to pass the plaintext password
    // directly to the edge function where it will be properly hashed
  }
  
  return dbEmployee;
}

/**
 * Generate a random secure password
 */
export function generateSecurePassword(): string {
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
}
