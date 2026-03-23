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

/** Corpo enviado à API (create / update completo). */
export interface CreateUserBody {
  nome: string;
  email: string;
  funcao: string;
  dataNascimento: string;
  genero: 'M' | 'F';
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export function buildCreateUserBody(raw: UserFormRawValue): CreateUserBody {
  const dataNascimento = birthDisplayToIso(raw.dataNascimento);
  const cep = CepService.normalizeCep(raw.cep);
  const estado = raw.estado.trim().toUpperCase().slice(0, 2);
  return {
    nome: raw.nome.trim(),
    email: '',
    funcao: raw.funcao,
    dataNascimento,
    genero: raw.genero,
    cep,
    logradouro: raw.logradouro.trim(),
    bairro: raw.bairro.trim(),
    cidade: raw.cidade.trim(),
    estado,
  };
}
