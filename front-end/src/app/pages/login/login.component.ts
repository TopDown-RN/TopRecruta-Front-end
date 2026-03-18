import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.getRawValue();
    if (this.auth.login(username, password)) {
      this.router.navigate(['/users']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos. Tente novamente.';
    }
  }
}
