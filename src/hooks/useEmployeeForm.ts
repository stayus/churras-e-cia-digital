
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
      role: 'employee' as 'admin' | 'employee' | 'motoboy',
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
    // Enhanced validations
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
    
    // Validate username format (lowercase letters only)
    if (!/^[a-z]+$/.test(formData.username)) {
      toast({
        variant: 'destructive',
        title: 'Formato inválido',
        description: 'O nome de usuário deve conter apenas letras minúsculas, sem números ou espaços.'
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
    
    // Validate password complexity
    if (isNew && password && (
      password.length < 8 || 
      !/[A-Z]/.test(password) || 
      !/[a-z]/.test(password) || 
      !/[0-9]/.test(password) || 
      !/[^A-Za-z0-9]/.test(password)
    )) {
      toast({
        variant: 'destructive',
        title: 'Senha inválida',
        description: 'A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e caracteres especiais.'
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
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o funcionário.'
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
