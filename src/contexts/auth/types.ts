
import { Session } from '@supabase/supabase-js';

// Types for our auth context
export type UserRole = 'admin' | 'employee' | 'motoboy' | 'customer';

export interface UserData {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  username?: string;
  registration_number?: string;
  permissions?: {
    manageStock: boolean;
    viewReports: boolean;
    changeOrderStatus: boolean;
    exportOrderReportPDF?: boolean;
    promotionProducts?: boolean;
  };
  isFirstLogin?: boolean;
  email_confirmed_at?: string | null;
}

export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentialType: 'email' | 'username', credential: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}
