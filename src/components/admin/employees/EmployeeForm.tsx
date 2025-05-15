
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { Copy, RefreshCw } from 'lucide-react';

interface EmployeeFormProps {
  employee: Employee | null;
  onSave: (employee: Partial<Employee>, isNew: boolean) => void;
  onCancel: () => void;
  generatePassword: () => string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSave, 
  onCancel,
  generatePassword
}) => {
  const isNew = !employee;
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      name: '',
      username: '',
      role: 'employee',
      cpf: '',
      birthDate: '',
      phone: '',
      pixKey: '',
      permissions: {
        manageStock: false,
        viewReports: false,
        changeOrderStatus: false,
        exportOrderReportPDF: false,
        promotionProducts: false
      }
    }
  );
  
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission: keyof Employee['permissions'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions!,
        [permission]: checked
      }
    }));
  };

  const generateAndSetPassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: 'Senha copiada',
      description: 'A senha foi copiada para a área de transferência.'
    });
  };

  const validateForm = (): boolean => {
    // Validação de campos obrigatórios
    if (!formData.name?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campo obrigatório',
        description: 'O nome completo é obrigatório.'
      });
      return false;
    }
    
    // Validação de nome (pelo menos nome e sobrenome)
    const nameParts = formData.name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Nome inválido',
        description: 'Digite o nome completo (nome e sobrenome).'
      });
      return false;
    }
    
    // Validação de usuário
    if (!formData.username?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campo obrigatório',
        description: 'O nome de usuário é obrigatório.'
      });
      return false;
    }
    
    // Verificação de senha para novo funcionário
    if (isNew && !password) {
      toast({
        variant: 'destructive',
        title: 'Senha obrigatória',
        description: 'Gere uma senha para o novo funcionário.'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Adiciona a senha ao objeto apenas se for um novo funcionário
      const employeeData = {
        ...formData
      };
      
      if (isNew && password) {
        employeeData.password = password;
      }
      
      await onSave(employeeData, isNew);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            placeholder="Nome e sobrenome"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Usuário *</Label>
          <Input
            id="username"
            placeholder="nome.usuario"
            value={formData.username}
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
            value={formData.role}
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
        
        {isNew && (
          <div className="space-y-2">
            <Label htmlFor="password">Senha Temporária *</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                value={password}
                readOnly
                placeholder="Clique em 'Gerar Senha'"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateAndSetPassword}
                className="whitespace-nowrap"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Senha
              </Button>
              {password && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyPasswordToClipboard}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copiar</span>
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Uma senha temporária será gerada para o primeiro acesso.
            </p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Permissões</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission-status"
              checked={formData.permissions?.changeOrderStatus || false}
              onCheckedChange={(checked) => 
                handlePermissionChange('changeOrderStatus', checked === true)
              }
            />
            <Label htmlFor="permission-status">Alterar status do pedido</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission-stock"
              checked={formData.permissions?.manageStock || false}
              onCheckedChange={(checked) => 
                handlePermissionChange('manageStock', checked === true)
              }
            />
            <Label htmlFor="permission-stock">Alterar status do produto</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission-reports"
              checked={formData.permissions?.viewReports || false}
              onCheckedChange={(checked) => 
                handlePermissionChange('viewReports', checked === true)
              }
            />
            <Label htmlFor="permission-reports">Visualizar relatório de vendas do dia</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission-export"
              checked={formData.permissions?.exportOrderReportPDF || false}
              onCheckedChange={(checked) => 
                handlePermissionChange('exportOrderReportPDF', checked === true)
              }
            />
            <Label htmlFor="permission-export">Exportação de relatório em PDF</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permission-promotion"
              checked={formData.permissions?.promotionProducts || false}
              onCheckedChange={(checked) => 
                handlePermissionChange('promotionProducts', checked === true)
              }
            />
            <Label htmlFor="permission-promotion">Colocar produtos em promoção</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : isNew ? 'Adicionar Funcionário' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
