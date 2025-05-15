
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Input as FormInput } from '@/components/ui/input';
import { Employee } from '@/types/dashboard';

interface EmployeeBasicInfoProps {
  formData: Partial<Employee>;
  handleChange: (field: string, value: any) => void;
  isNew: boolean;
}

const EmployeeBasicInfo: React.FC<EmployeeBasicInfoProps> = ({ 
  formData, 
  handleChange,
  isNew
}) => {
  // Format phone number as user types (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    if (!value) return value;
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format the phone number
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    } else {
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
    }
  };
  
  // Format CPF as user types XXX.XXX.XXX-XX
  const formatCPF = (value: string) => {
    if (!value) return value;
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format the CPF
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.substring(0, 3)}.${digits.substring(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`;
    } else {
      return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
    }
  };
  
  // Validate name to ensure it has at least first and last name
  const validateName = (name: string) => {
    const nameParts = name.trim().split(/\s+/);
    return nameParts.length >= 2;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input
          id="name"
          placeholder="Nome e sobrenome"
          value={formData.name || ''}
          onChange={(e) => {
            const value = e.target.value;
            handleChange('name', value);
          }}
          onBlur={(e) => {
            const value = e.target.value;
            if (value && !validateName(value)) {
              alert('Digite o nome completo (nome e sobrenome)');
            }
          }}
          required
        />
        <p className="text-xs text-muted-foreground">Digite o nome completo (nome e sobrenome)</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Usuário *</Label>
        <Input
          id="username"
          placeholder="nome.usuario"
          value={formData.username || ''}
          onChange={(e) => handleChange('username', e.target.value.toLowerCase())}
          required
          disabled={!isNew} // Não permitir edição do username
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf || ''}
          onChange={(e) => {
            const formatted = formatCPF(e.target.value);
            handleChange('cpf', formatted);
          }}
          maxLength={14} // XXX.XXX.XXX-XX (14 characters)
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate || ''}
          onChange={(e) => handleChange('birthDate', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone || ''}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            handleChange('phone', formatted);
          }}
          maxLength={15} // (XX) XXXXX-XXXX (15 characters)
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Cargo *</Label>
        <Input
          id="role"
          placeholder="Digite o cargo"
          value={formData.role || ''}
          onChange={(e) => handleChange('role', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pixKey">Chave PIX</Label>
        <Input
          id="pixKey"
          placeholder="Chave PIX para pagamentos"
          value={formData.pixKey || ''}
          onChange={(e) => handleChange('pixKey', e.target.value)}
        />
      </div>
    </div>
  );
};

export default EmployeeBasicInfo;
