import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  avatarUrlForGenero,
  formatAgeFromBirth,
  formatCreatedAtBr,
} from '../../../core/utils/user-list.util';
import { UsersService } from '../../../core/services/users.service';
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

  users: User[] = [];
  deleteDialogUser: User | null = null;

  readonly avatarUrl = avatarUrlForGenero;
  readonly ageLabel = formatAgeFromBirth;
  readonly addedAtLabel = formatCreatedAtBr;

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
        this.deleteDialogUser = null;
        this.loadUsers();
      },
    });
  }

  private loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.users = [];
      },
    });
  }
}
