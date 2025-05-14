
import React from 'react';

interface LoginHeaderProps {
  title: string;
  description: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-red-600">{title}</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default LoginHeader;
