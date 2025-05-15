
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input
          id="name"
          placeholder="Nome e sobrenome"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
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
          onChange={(e) => handleChange('cpf', e.target.value)}
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
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Cargo *</Label>
        <Select
          value={formData.role || ''}
          onValueChange={(value) => handleChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="employee">Funcionário</SelectItem>
            <SelectItem value="motoboy">Motoboy</SelectItem>
          </SelectContent>
        </Select>
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
