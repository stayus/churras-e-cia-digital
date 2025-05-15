
import { useState } from 'react';
import { Employee } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export const useEmployeeForm = (
  employee: Employee | null,
  onSave: (employee: Partial<Employee>, isNew: boolean) => void
) => {
  const isNew = !employee;
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      name: '',
      username: '',
      role: '',
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
    
    // Validação de cargo
    if (!formData.role?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campo obrigatório',
        description: 'O cargo é obrigatório.'
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
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar o funcionário.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isNew,
    password,
    setPassword,
    isSubmitting,
    handleChange,
    handlePermissionChange,
    handleSubmit
  };
};
