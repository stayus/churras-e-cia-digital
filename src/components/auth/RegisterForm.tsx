
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form } from '@/components/ui/form';
import { useRegisterForm } from './register/useRegisterForm';
import { PersonalInfoSection, AddressSection, PasswordSection } from './register/FormSections';

const RegisterForm = () => {
  const { form, isLoading, error, onSubmit } = useRegisterForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <PersonalInfoSection form={form} isLoading={isLoading} />
          <AddressSection form={form} isLoading={isLoading} />
          <PasswordSection form={form} isLoading={isLoading} />
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default RegisterForm;
