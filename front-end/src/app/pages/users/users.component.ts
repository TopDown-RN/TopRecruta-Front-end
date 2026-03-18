import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Página placeholder para /users.
 * Será substituída pelo CRUD de usuários em etapa posterior.
 */
@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-xl font-semibold text-gray-800">Usuários</h1>
          <button
            type="button"
            (click)="logout()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sair
          </button>
        </div>
        <p class="text-gray-600">Você está autenticado. O CRUD de usuários será implementado aqui.</p>
      </div>
    </div>
  `,
})
export class UsersComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
