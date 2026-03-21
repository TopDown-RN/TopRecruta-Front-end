import { ValidationErrors } from '@angular/forms';

// Mensagem amigável para erros comuns dos controles do formulário de usuário 
export function userFormControlMessage(
  errors: ValidationErrors | null | undefined,
): string | null {
  if (!errors) return null;

  if (errors['required']) return 'Campo obrigatório.';
  if (errors['maxlength']) {
    return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
  }
  if (errors['email']) return 'Informe um e-mail válido.';
  if (errors['pattern']) return 'CEP deve ter 8 dígitos.';
  if (errors['birthDateIncomplete'])
    return 'Informe a data completa (DD/MM/AAAA).';
  if (errors['birthDateInvalid'])
    return 'Informe uma data válida (DD/MM/AAAA).';
  if (errors['birthDateFuture'])
    return 'Data de nascimento não pode ser futura.';
  return null;
}
