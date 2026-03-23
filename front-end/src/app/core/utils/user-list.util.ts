import { UserGenero } from '../../models/user.model';

// Valor exibido quando data ou idade não são válidos 
export const EMPTY_DISPLAY = '—';

const AVATAR_BY_GENERO: Record<UserGenero, string> = {
  M: '/avatars/Masculino.png',
  F: '/avatars/Feminino.png',
};

export function avatarUrlForGenero(genero: UserGenero): string {
  return AVATAR_BY_GENERO[genero];
}

// Idade a partir de data de nascimento 
export function formatAgeFromBirth(dataNascimento: string): string {
  if (!dataNascimento) return EMPTY_DISPLAY;

  const birthDate = new Date(dataNascimento);
  if (Number.isNaN(birthDate.getTime())) return EMPTY_DISPLAY;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const hasNotHadBirthdayYet =
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayYet) age--;

  return `${age} anos`;
}

// Data ISO para `DD/MM/AAAA` para exibição na lista 
export function formatCreatedAtBr(createdAt: string): string {
  if (!createdAt) return EMPTY_DISPLAY;

  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return EMPTY_DISPLAY;

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
}

// CEP para exibição (formato `00000-000`)
export function formatCepBr(cep: string): string {
  if (!cep) return EMPTY_DISPLAY;

  const digits = cep.replace(/\D/g, '').slice(0, 8);
  if (digits.length !== 8) return digits || EMPTY_DISPLAY;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
