export type UserGenero = 'M' | 'F';

export interface User {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  dataNascimento: string;
  genero: UserGenero;
  createdAt: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Limite de caracteres para nome
export const NOME_MAX_LENGTH = 100;

// Limite de caracteres para e-mail 
export const EMAIL_MAX_LENGTH = 254;

// Opções do dropdown de funções
export const FUNCOES_OPCOES = [
  'Dev Back-end',
  'Dev Front-end',
  'Dev Full Stack',
  'UX/UI Designer',
] as const;

