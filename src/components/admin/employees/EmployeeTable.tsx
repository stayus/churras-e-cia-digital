
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Employee } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-600">Administrador</Badge>;
      case 'employee':
        return <Badge className="bg-blue-600">Funcionário</Badge>;
      case 'motoboy':
        return <Badge className="bg-green-600">Motoboy</Badge>;
      default:
        return <Badge className="bg-gray-600">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4].map((i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell>
                  <div className="h-5 bg-gray-200 rounded w-48"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-9 bg-gray-200 rounded w-20 ml-auto"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="rounded-md border p-8">
        <p className="text-center text-muted-foreground">
          Nenhum funcionário cadastrado. Utilize o botão "Adicionar Funcionário" para começar.
        </p>
      </div>
    );
  }

  console.log('Rendering employee table with employees:', employees);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell>{getRoleBadge(employee.role)}</TableCell>
              <TableCell>{employee.registrationNumber}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(employee)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
