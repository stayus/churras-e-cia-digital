
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import CustomerLoginForm from '@/components/auth/CustomerLoginForm';
import EmployeeLoginForm from '@/components/auth/EmployeeLoginForm';
import LoginHeader from '@/components/auth/LoginHeader';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'employee'>('customer');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader 
          title="Churrasquinho & Cia" 
          description="O melhor churrasquinho da região!"
        />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'employee' | 'customer')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Clientes</TabsTrigger>
              <TabsTrigger value="employee">Funcionários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <CustomerLoginForm />
            </TabsContent>
            
            <TabsContent value="employee">
              <EmployeeLoginForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
