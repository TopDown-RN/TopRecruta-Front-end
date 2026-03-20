/**
 * Modal para edição de usuário.
 * Reutiliza o mesmo formulário/validações do create (com busca de endereço por CEP).
 */
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CepService } from '../../../core/services/cep.service';
import { FUNCOES_OPCOES, NOME_MAX_LENGTH, User, UserGenero } from '../../../models/user.model';

const CEP_DEBOUNCE_MS = 400;
const CEP_LENGTH = 8;

@Component({
  selector: 'edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modal.component.html',
})
export class EditModalComponent implements OnInit {
  @Input({ required: true }) user!: User;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cepService = inject(CepService);
  private readonly destroyRef = inject(DestroyRef);

  readonly funcoesOpcoes = FUNCOES_OPCOES;
  readonly nomeMaxLength = NOME_MAX_LENGTH;

  cepLoading = false;
  cepError: string | null = null;

  // Observação: campos de endereço ficam desabilitados e apenas exibem o que a ViaCEP retornou.
  form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(NOME_MAX_LENGTH)]],
    funcao: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required]],
    genero: this.fb.control<UserGenero>('M', [Validators.required]),
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    logradouro: [{ value: '', disabled: true }, [Validators.required]],
    bairro: [{ value: '', disabled: true }, [Validators.required]],
    cidade: [{ value: '', disabled: true }, [Validators.required]],
    estado: [{ value: '', disabled: true }, [Validators.required]],
  });

  ngOnInit(): void {
    this.patchInitialValues();
    // Garante que abrir o modal e preencher valores não marque o form como "alterado".
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setupCepSubscription();
  }

  // Fecha o modal ao clicar fora do conteúdo
  onBackdropClick(): void {
    this.cancel.emit();
  }

  // Evita que o clique dentro do modal feche ele
  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onCancelClick(): void {
    this.cancel.emit();
  }

  onConfirmClick(): void {
    // Mantém a lógica central no (ngSubmit); esse método fica apenas para compatibilidade visual.
  }

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
                this.form.patchValue(
                  {
                    logradouro: address.logradouro,
                    bairro: address.bairro,
                    cidade: address.cidade,
                    estado: address.estado,
                  },
                  { emitEvent: false },
                );
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

  private setAddressFieldsDisabled(): void {
    this.form.controls.logradouro.disable();
    this.form.controls.bairro.disable();
    this.form.controls.cidade.disable();
    this.form.controls.estado.disable();
    this.form.patchValue(
      {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      { emitEvent: false },
    );
  }

  private patchInitialValues(): void {
    if (!this.user) return;

    this.form.patchValue(
      {
        nome: this.user.nome ?? '',
        funcao: this.user.funcao ?? '',
        dataNascimento: this.isoToDataNascimentoBR(this.user.dataNascimento),
        genero: this.user.genero ?? 'M',
        cep: this.normalizeCep(this.user.cep),
        logradouro: this.user.logradouro ?? '',
        bairro: this.user.bairro ?? '',
        cidade: this.user.cidade ?? '',
        estado: this.user.estado ?? '',
      },
      { emitEvent: false },
    );
  }

  private resetFormToInitialValues(): void {
    if (!this.user) return;

    this.cepError = null;
    this.form.reset(
      {
        nome: this.user.nome ?? '',
        funcao: this.user.funcao ?? '',
        dataNascimento: this.isoToDataNascimentoBR(this.user.dataNascimento),
        genero: this.user.genero ?? 'M',
        cep: this.normalizeCep(this.user.cep),
        logradouro: this.user.logradouro ?? '',
        bairro: this.user.bairro ?? '',
        cidade: this.user.cidade ?? '',
        estado: this.user.estado ?? '',
      },
      { emitEvent: false },
    );

    this.form.controls.logradouro.disable();
    this.form.controls.bairro.disable();
    this.form.controls.cidade.disable();
    this.form.controls.estado.disable();

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private normalizeCep(value: string): string {
    return (value ?? '').replace(/\D/g, '').slice(0, CEP_LENGTH);
  }

  // No input do CEP, mantém apenas dígitos e limita a 8 caracteres
  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, CEP_LENGTH);
    this.form.controls.cep.setValue(digits, { emitEvent: true });
  }

  // Ao sair do CEP, garante que fica exatamente com 8 dígitos (sem disparar lookup novamente)
  onCepBlur(): void {
    const value = this.form.controls.cep.value ?? '';
    const digits = value.replace(/\D/g, '');
    if (digits.length === CEP_LENGTH) {
      this.form.controls.cep.setValue(digits, { emitEvent: false });
    }
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

  // Converte ISO (YYYY-MM-DD ou similar) para DD/MM/AAAA para preencher o input
  private isoToDataNascimentoBR(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '';

    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Converte data em DD/MM/AAAA (apenas dígitos) para ISO YYYY-MM-DD.
  // Se não tiver 8 dígitos, devolve o valor original.
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

    const updatedUser: User = {
      id: this.user.id,
      nome: raw.nome.trim(),
      email: this.user.email ?? '',
      funcao: raw.funcao,
      dataNascimento: dataNascimentoIso,
      genero: raw.genero,
      createdAt: this.user.createdAt,
      cep: raw.cep.replace(/\D/g, ''),
      logradouro: raw.logradouro.trim(),
      bairro: raw.bairro.trim(),
      cidade: raw.cidade.trim(),
      estado: raw.estado.trim(),
    };

    this.save.emit(updatedUser);
  }

  // Usado no template
  resetForm(): void {
    this.resetFormToInitialValues();
  }
}

