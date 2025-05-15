
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form
} from '@/components/ui/form';

import FormSection from './form/FormSection';
import PersonalInfoFields from './form/PersonalInfoFields';
import RoleField from './form/RoleField';
import PermissionsFields from './form/PermissionsFields';
import PasswordField from './form/PasswordField';

// Employee form schema with validation
export const employeeSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+ [A-Za-zÀ-ÖØ-öø-ÿ ]+$/, { 
      message: 'Digite o nome completo (nome e sobrenome)' 
    }),
  username: z.string().min(3, { message: 'Username deve ter pelo menos 3 caracteres' })
    .regex(/^[a-z]+$/, { 
      message: 'Username deve conter apenas letras minúsculas, sem números ou espaços' 
    }),
  cpf: z.string().optional()
    .refine(val => !val || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val), {
      message: 'CPF deve estar no formato 000.000.000-00'
    }),
  phone: z.string().optional()
    .refine(val => !val || /^\(\d{2}\) \d{5}-\d{4}$/.test(val), {
      message: 'Telefone deve estar no formato (00) 00000-0000'
    }),
  birth_date: z.date().optional(),
  pix_key: z.string().optional(),
  role: z.string().min(1, { message: 'Cargo é obrigatório' }),
  permissions: z.object({
    manageStock: z.boolean().default(false),
    viewReports: z.boolean().default(false),
    changeOrderStatus: z.boolean().default(false),
    exportOrderReportPDF: z.boolean().default(false),
    promotionProducts: z.boolean().default(false),
  }),
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EmployeeFormValues) => void;
  defaultValues?: Partial<EmployeeFormValues>;
  isEditing?: boolean;
}

const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}) => {
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  // Initialize the form with default values or empty values
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues || {
      name: '',
      username: '',
      cpf: '',
      phone: '',
      birth_date: undefined,
      pix_key: '',
      role: '',
      permissions: {
        manageStock: false,
        viewReports: false,
        changeOrderStatus: false,
        exportOrderReportPDF: false,
        promotionProducts: false,
      },
      password: '',
    },
  });

  // Generate a random password
  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+{}[]|:;<>,.?/~';
    
    const all = lowercase + uppercase + numbers + special;
    let password = '';
    
    // Ensure we have at least one of each character type
    password += lowercase[Math.floor(Math.random() * lowercase.length)]; 
    password += uppercase[Math.floor(Math.random() * uppercase.length)]; 
    password += numbers[Math.floor(Math.random() * numbers.length)]; 
    password += special[Math.floor(Math.random() * special.length)]; 
    
    // Fill the rest
    for (let i = 4; i < 8; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the password
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    
    setGeneratedPassword(password);
    form.setValue('password', password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar funcionário' : 'Cadastrar novo funcionário'}
          </DialogTitle>
          <DialogDescription>
            Preencha o formulário com os dados do funcionário.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="Informações Pessoais" description="Dados básicos do funcionário">
              <div className="grid gap-4">
                <PersonalInfoFields form={form} isEditing={isEditing} />
              </div>
            </FormSection>
            
            <FormSection title="Função">
              <RoleField form={form} />
            </FormSection>
            
            <FormSection title="Permissões" description="Configure o que este funcionário pode fazer">
              <PermissionsFields form={form} />
            </FormSection>
            
            {!isEditing && (
              <FormSection>
                <PasswordField 
                  form={form}
                  generatedPassword={generatedPassword}
                  setGeneratedPassword={setGeneratedPassword}
                  generatePassword={generatePassword}
                />
              </FormSection>
            )}
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
