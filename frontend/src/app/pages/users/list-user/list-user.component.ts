import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  avatarUrlForGenero,
  formatAgeFromBirth,
  formatCreatedAtBr,
  formatCepBr,
} from '../../../core/utils/user-list.util';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from 'ngx-toast-lib';
import { User } from '../../../models/user.model';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, RouterLink, DeleteModalComponent],
  templateUrl: './list-user.component.html',
})
export class ListUserComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  users: User[] = [];
  // Evita mostrar "nenhum usuário" enquanto o GET /users ainda não terminou
  loading = true;
  deleteDialogUser: User | null = null;

  readonly avatarUrl = avatarUrlForGenero;
  readonly ageLabel = formatAgeFromBirth;
  readonly addedAtLabel = formatCreatedAtBr;
  readonly cepLabel = formatCepBr;

  ngOnInit(): void {
    this.loadUsers();
  }

  requestDelete(user: User): void {
    this.deleteDialogUser = user;
  }

  cancelDelete(): void {
    this.deleteDialogUser = null;
  }

  confirmDelete(): void {
    const target = this.deleteDialogUser;
    if (!target) return;

    this.usersService.deleteUser(target.id).subscribe({
      next: () => {
        this.toastService.add({
          title: 'Sucesso!',
          message: 'Usuário excluído com sucesso.',
          type: 'custom',
          icon: 'tabler:user-x',
          iconColor: 'text-white',
          bgColor: 'bg-[#3C7588]',
          duration: 1500,
        });
        this.deleteDialogUser = null;
        this.loadUsers();
      },
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.loading = false;
      },
    });
  }
}
