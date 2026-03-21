import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Valida data de nascimento em DD/MM/AAAA (8 dígitos) como data de calendário válida 
export function birthDateBrValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) {
      return null;
    }

    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) {
      return null;
    }
    if (digits.length < 8) {
      return { birthDateIncomplete: true };
    }

    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { birthDateInvalid: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birth = new Date(date);
    birth.setHours(0, 0, 0, 0);

    if (birth > today) {
      return { birthDateFuture: true };
    }

    return null;
  };
}
