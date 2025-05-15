
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatPhone, formatCPF, validateCPF, validatePhone } from '@/lib/format';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../EmployeeFormDialog';
import { toast } from '@/hooks/use-toast';

interface PersonalInfoFieldsProps {
  form: UseFormReturn<EmployeeFormValues>;
  isEditing: boolean;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ form, isEditing }) => {
  return (
    <>
      {/* Nome completo */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Nome e sobrenome" {...field} />
            </FormControl>
            <FormDescription>
              Digite o nome completo do funcionário.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Username */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input 
                placeholder="username" 
                {...field} 
                onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                disabled={isEditing}
              />
            </FormControl>
            <FormDescription>
              Apenas letras minúsculas, sem espaços ou números.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* CPF */}
      <FormField
        control={form.control}
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF (opcional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="000.000.000-00" 
                {...field} 
                value={field.value || ''}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  field.onChange(formatted);
                }}
                onBlur={(e) => {
                  // Validar o CPF quando o campo perde o foco
                  if (e.target.value && !validateCPF(e.target.value)) {
                    toast({
                      title: "CPF inválido",
                      description: "O CPF informado não é válido.",
                      variant: "destructive"
                    });
                    // Opcional: limpar o campo quando inválido
                    // field.onChange("");
                  }
                }}
                maxLength={14}
              />
            </FormControl>
            <FormDescription>
              Formato: 000.000.000-00
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Telefone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone (opcional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="(00) 00000-0000" 
                {...field} 
                value={field.value || ''}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  field.onChange(formatted);
                }}
                onBlur={(e) => {
                  // Validar o telefone quando o campo perde o foco
                  if (e.target.value && !validatePhone(e.target.value)) {
                    toast({
                      title: "Telefone inválido",
                      description: "O telefone deve estar no formato (00) 00000-0000.",
                      variant: "destructive"
                    });
                    // Opcional: limpar o campo quando inválido
                    // field.onChange("");
                  }
                }}
                maxLength={15}
              />
            </FormControl>
            <FormDescription>
              Formato: (00) 00000-0000
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Data de Nascimento */}
      <FormField
        control={form.control}
        name="birth_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data de Nascimento (opcional)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>DD/MM/YYYY</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Chave Pix */}
      <FormField
        control={form.control}
        name="pix_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave Pix (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="CPF, e-mail, telefone ou chave aleatória" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoFields;
