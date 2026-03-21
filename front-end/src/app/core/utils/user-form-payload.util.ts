import { User } from '../../models/user.model';
import { CepService } from '../services/cep.service';
import { birthDisplayToIso } from './birth-date-form.util';

// Saída de `form.getRawValue()` do formulário de usuário 
export interface UserFormRawValue {
  nome: string;
  funcao: string;
  dataNascimento: string;
  genero: 'M' | 'F';
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export function generateUserId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Monta o `User` a partir do form; `existing` em modo edição, `null` em criação 
export function userFromFormRaw(
  raw: UserFormRawValue,
  existing: User | null,
): User {
  const dataNascimento = birthDisplayToIso(raw.dataNascimento);
  const cep = CepService.normalizeCep(raw.cep);

  const common = {
    nome: raw.nome.trim(),
    email: '',
    funcao: raw.funcao,
    dataNascimento,
    genero: raw.genero,
    cep,
    logradouro: raw.logradouro.trim(),
    bairro: raw.bairro.trim(),
    cidade: raw.cidade.trim(),
    estado: raw.estado.trim(),
  };

  if (existing) {
    return {
      ...common,
      id: existing.id,
      createdAt: existing.createdAt,
    };
  }

  return {
    ...common,
    id: generateUserId(),
    createdAt: new Date().toISOString(),
  };
}
