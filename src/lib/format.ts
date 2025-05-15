
/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
};

/**
 * Formata uma data/hora para o formato brasileiro (DD/MM/YYYY HH:MM)
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Formata um número de telefone para o formato brasileiro (00) 00000-0000
 */
export const formatPhone = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const digits = value.replace(/\D/g, '');
  
  // Formata o número de telefone
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 7) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
};

/**
 * Formata um CPF para o formato brasileiro 000.000.000-00
 */
export const formatCPF = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const digits = value.replace(/\D/g, '');
  
  // Formata o CPF
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.substring(0, 3)}.${digits.substring(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`;
  } else {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
  }
};

/**
 * Valida se um CPF é válido (formato e dígitos verificadores)
 */
export const validateCPF = (cpf: string): boolean => {
  // Verifica se o CPF está vazio ou é um campo opcional
  if (!cpf) return true;
  
  // Remove todos os caracteres não numéricos
  const digits = cpf.replace(/\D/g, '');
  
  // Verifica se o CPF tem 11 dígitos
  if (digits.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais, o que torna o CPF inválido
  if (/^(\d)\1+$/.test(digits)) return false;
  
  // Algoritmo de validação do CPF
  let sum = 0;
  let rest;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(digits.substring(i-1, i)) * (11 - i);
  }
  
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits.substring(9, 10))) return false;
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(digits.substring(i-1, i)) * (12 - i);
  }
  
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits.substring(10, 11))) return false;
  
  return true;
};

/**
 * Valida se um número de telefone está no formato correto
 */
export const validatePhone = (phone: string): boolean => {
  // Verifica se o telefone está vazio ou é um campo opcional
  if (!phone) return true;
  
  // Remove todos os caracteres não numéricos
  const digits = phone.replace(/\D/g, '');
  
  // Verifica se o telefone tem entre 10 e 11 dígitos (com ou sem o 9 do celular)
  return digits.length >= 10 && digits.length <= 11;
};

