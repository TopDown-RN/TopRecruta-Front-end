/**
 * Tela de cadastro de novo usuário.
 * Formulário reativo com validação, integração ViaCEP para endereço e persistência em localStorage.
 */
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CepService } from '../../../core/services/cep.service';
import { UsersService } from '../../../core/services/users.service';
import { User, FUNCOES_OPCOES, NOME_MAX_LENGTH } from '../../../models/user.model';

// Tempo de espera em milissegundos antes de disparar a busca de CEP
const CEP_DEBOUNCE_MS = 400;
// Quantidade de dígitos numéricos de um CEP válido
const CEP_LENGTH = 8;

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cepService = inject(CepService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly funcoesOpcoes = FUNCOES_OPCOES;
  readonly nomeMaxLength = NOME_MAX_LENGTH;

  // Indica se está em andamento a busca de endereço por CEP
  cepLoading = false;
  // Mensagem de erro da busca por CEP 
  cepError: string | null = null;

  // Campos de endereço ficam desabilitados até o CEP ser consultado
  form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(NOME_MAX_LENGTH)]],
    funcao: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required]],
    genero: this.fb.control<'M' | 'F'>('M', [Validators.required]),
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    logradouro: [{ value: '', disabled: true }, [Validators.required]],
    bairro: [{ value: '', disabled: true }, [Validators.required]],
    cidade: [{ value: '', disabled: true }, [Validators.required]],
    estado: [{ value: '', disabled: true }, [Validators.required]],
  });

  ngOnInit(): void {
    this.setupCepSubscription();
  }

  // Ao completar 8 dígitos, busca endereço na ViaCEP e preenche os campos (permanecem desabilitados) 
  private setupCepSubscription(): void {
    this.form.controls.cep.valueChanges
      .pipe(
        debounceTime(CEP_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        const digits = (value ?? '').replace(/\D/g, '');
        this.cepError = null;

        if (digits.length !== CEP_LENGTH) {
          this.setAddressFieldsDisabled();
          return;
        }

        this.cepLoading = true;
        this.cepService
          .getAddress(digits)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (address) => {
              this.cepLoading = false;
              if (address) {
                this.form.patchValue({
                  logradouro: address.logradouro,
                  bairro: address.bairro,
                  cidade: address.cidade,
                  estado: address.estado,
                });
                this.cepError = null;
              } else {
                this.cepError = 'CEP não encontrado.';
                this.setAddressFieldsDisabled();
              }
            },
            error: () => {
              this.cepLoading = false;
              this.cepError = 'Erro ao buscar CEP. Tente novamente.';
              this.setAddressFieldsDisabled();
            },
          });
      });
  }

  // Desabilita e limpa os campos de endereço quando CEP está vazio/inválido ou quando a busca falha 
  private setAddressFieldsDisabled(): void {
    this.form.controls.logradouro.disable();
    this.form.controls.bairro.disable();
    this.form.controls.cidade.disable();
    this.form.controls.estado.disable();
    this.form.patchValue({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
  }

  // Normaliza o valor para apenas 8 dígitos
  onCepBlur(): void {
    const value = this.form.controls.cep.value ?? '';
    const digits = value.replace(/\D/g, '');
    if (digits.length === CEP_LENGTH) {
      this.form.controls.cep.setValue(digits, { emitEvent: false });
    }
  }

  // No input do CEP, mantém apenas dígitos e limita a 8 caracteres
  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, CEP_LENGTH);
    this.form.controls.cep.setValue(digits, { emitEvent: true });
  }

  // Verifica se o controle possui o erro indicado e já foi tocado
  hasError(controlName: keyof typeof this.form.controls, errorKey: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.invalid && control?.touched && control?.errors?.[errorKey]);
  }

  // Retorna a mensagem de erro do controle para exibição no template ou null se não houver
  getControlError(controlName: keyof typeof this.form.controls): string | null {
    const control = this.form.get(controlName);
    if (!control?.touched || !control?.errors) return null;
    const err = control.errors;
    if (err['required']) return 'Campo obrigatório.';
    if (err['maxlength']) return `Máximo de ${err['maxlength'].requiredLength} caracteres.`;
    if (err['pattern']) return 'CEP deve ter 8 dígitos.';
    return null;
  }

  // Limpa todos os campos do formulário e reseta o estado de erro do CEP
  clearForm(): void {
    this.cepError = null;
    this.form.reset({
      nome: '',
      funcao: '',
      dataNascimento: '',
      genero: 'M',
      cep: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
    this.setAddressFieldsDisabled();
    this.form.controls.genero.setValue('M');
    // Garante que "Limpar" volte a deixar o formulário sem alterações
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  // Navega de volta para a listagem de usuários sem salvar
  cancel(): void {
    this.router.navigate(['/users']);
  }

  // Converte data em DD/MM/AAAA (apenas dígitos) para ISO YYYY-MM-DD. Se não tiver 8 dígitos, devolve o valor original 
  private dataNascimentoToIso(value: string): string {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return '';
    const ddmmaa = trimmed.replace(/\D/g, '');
    if (ddmmaa.length === 8) {
      const d = ddmmaa.slice(0, 2);
      const m = ddmmaa.slice(2, 4);
      const a = ddmmaa.slice(4, 8);
      return `${a}-${m}-${d}`;
    }
    return trimmed;
  }

  // Valida o formulário, monta o User, persiste via UsersService e redireciona para /users 
  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const cepDigits = (raw.cep ?? '').replace(/\D/g, '');
    if (cepDigits.length === CEP_LENGTH && !raw.logradouro?.trim()) {
      this.cepError = 'Informe um CEP válido e aguarde o preenchimento do endereço.';
      return;
    }
    const dataNascimentoIso = this.dataNascimentoToIso(raw.dataNascimento);

    const user: User = {
      id: this.generateId(),
      nome: raw.nome.trim(),
      email: '',
      funcao: raw.funcao,
      dataNascimento: dataNascimentoIso,
      genero: raw.genero,
      createdAt: new Date().toISOString(),
      cep: raw.cep.replace(/\D/g, ''),
      logradouro: raw.logradouro.trim(),
      bairro: raw.bairro.trim(),
      cidade: raw.cidade.trim(),
      estado: raw.estado.trim(),
    };

    this.usersService.addUser(user);
    this.router.navigate(['/users']);
  }

  // Gera um id único para o novo usuário 
  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
