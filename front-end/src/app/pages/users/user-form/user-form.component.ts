import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CepService } from '../../../core/services/cep.service';
import { UsersService } from '../../../core/services/users.service';
import {
  isoDateToBirthDisplay,
  maskBirthDateInput,
} from '../../../core/utils/birth-date-form.util';
import { userFormControlMessage } from '../../../core/utils/user-form-errors.util';
import {
  UserFormRawValue,
  buildCreateUserBody,
} from '../../../core/utils/user-form-payload.util';
import { User, FUNCOES_OPCOES, NOME_MAX_LENGTH } from '../../../models/user.model';
import { buildUserFormGroup } from './user-form.factory';

const CEP_DEBOUNCE_MS = 400;

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cepService = inject(CepService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  @Input() userToEdit: User | null = null;
  @Input() formId = 'userForm';
  @Output() saved = new EventEmitter<void>();

  readonly funcoesOpcoes = FUNCOES_OPCOES;
  readonly nomeMaxLength = NOME_MAX_LENGTH;

  cepLoading = false;
  cepError: string | null = null;

  form = buildUserFormGroup(this.fb);

  ngOnInit(): void {
    this.applyInitialUser();
    this.setupCepSubscription();
  }

  get isEditMode(): boolean {
    return this.userToEdit !== null;
  }

  private applyInitialUser(): void {
    this.cepError = null;
    if (this.userToEdit) {
      this.patchFormFromUser(this.userToEdit);
    } else {
      this.resetFormEmpty();
    }
  }

  private patchFormFromUser(user: User): void {
    this.form.patchValue(
      {
        nome: user.nome ?? '',
        funcao: user.funcao ?? '',
        dataNascimento: isoDateToBirthDisplay(user.dataNascimento),
        genero: user.genero ?? 'M',
        cep: CepService.maskCep(user.cep),
        logradouro: user.logradouro ?? '',
        bairro: user.bairro ?? '',
        cidade: user.cidade ?? '',
        estado: user.estado ?? '',
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

  private resetFormEmpty(): void {
    this.form.reset(
      {
        nome: '',
        funcao: '',
        dataNascimento: '',
        genero: 'M',
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      { emitEvent: false },
    );
    this.setAddressFieldsDisabled();
    this.form.controls.genero.setValue('M');
    this.form.markAsPristine();
    this.form.markAsUntouched();
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

        if (!CepService.isValidCepFormat(value ?? '')) {
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

  onCepBlur(): void {
    const value = this.form.controls.cep.value ?? '';
    if (CepService.isValidCepFormat(value)) {
      this.form.controls.cep.setValue(CepService.maskCep(value), {
        emitEvent: false,
      });
    }
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    const masked = CepService.maskCep(digits);
    this.form.controls.cep.setValue(masked, { emitEvent: true });
  }

  onDataNascimentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.controls.dataNascimento.setValue(maskBirthDateInput(input.value), {
      emitEvent: true,
    });
  }

  getControlError(controlName: keyof typeof this.form.controls): string | null {
    const control = this.form.get(controlName);
    if (!control?.touched) return null;
    return userFormControlMessage(control.errors);
  }

  clearForm(): void {
    this.cepError = null;
    if (this.isEditMode && this.userToEdit) {
      this.patchFormFromUser(this.userToEdit);
      return;
    }
    this.resetFormEmpty();
  }

  cancel(): void {
    void this.router.navigate(['/users']);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue() as UserFormRawValue;
    const cepDigits = CepService.normalizeCep(raw.cep);
    if (cepDigits.length === 8 && !raw.logradouro?.trim()) {
      this.cepError =
        'Informe um CEP válido e aguarde o preenchimento do endereço.';
      return;
    }

    const body = buildCreateUserBody(raw);

    if (this.isEditMode && this.userToEdit) {
      this.usersService.updateUser(this.userToEdit.id, body).subscribe({
        next: () => this.saved.emit(),
      });
      return;
    }

    this.usersService.createUser(body).subscribe({
      next: () => this.saved.emit(),
    });
  }
}
