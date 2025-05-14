
import React from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';

interface PasswordChangeHeaderProps {
  userName: string;
}

const PasswordChangeHeader = ({ userName }: PasswordChangeHeaderProps) => {
  return (
    <>
      <CardTitle className="text-2xl font-bold text-center text-red-600">
        Primeiro Acesso
      </CardTitle>
      <CardDescription className="text-center">
        Olá, {userName}! Por razões de segurança, você precisa alterar sua senha temporária antes de continuar.
      </CardDescription>
    </>
  );
};

export default PasswordChangeHeader;
