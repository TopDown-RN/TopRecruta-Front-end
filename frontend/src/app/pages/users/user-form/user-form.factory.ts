import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { birthDateBrValidator } from '../../../core/validators/birth-date-br.validator';
import { NOME_MAX_LENGTH } from '../../../models/user.model';

export function buildUserFormGroup(fb: NonNullableFormBuilder) {
  return fb.group({
    nome: ['', [Validators.required, Validators.maxLength(NOME_MAX_LENGTH)]],
    funcao: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required, birthDateBrValidator()]],
    genero: fb.control<'M' | 'F'>('M', [Validators.required]),
    cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    logradouro: [{ value: '', disabled: true }, [Validators.required]],
    bairro: [{ value: '', disabled: true }, [Validators.required]],
    cidade: [{ value: '', disabled: true }, [Validators.required]],
    estado: [{ value: '', disabled: true }, [Validators.required]],
  });
}
