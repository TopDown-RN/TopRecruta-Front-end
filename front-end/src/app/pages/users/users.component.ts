import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { User, UserGenero } from '../../models/user.model';
import { DeleteModalComponent } from './delete-modal.component';

type UserListItem = User & {
  adicionadoEm?: string;
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private readonly emptyValue = '—';

  users: UserListItem[] = [];
  deleteDialogUser: UserListItem | null = null;

  // Dados de exemplo usados somente quando não existem usuários no `localStorage`
  private readonly mockUsers: UserListItem[] = [
    {
      id: '1',
      nome: 'Anderson',
      email: 'anderson@email.com',
      funcao: 'Dev Full Stack',
      dataNascimento: '1985-08-20',
      genero: 'M',
      createdAt: '2024-09-01T10:00:00.000Z',
      cep: '98765-432',
      logradouro: 'Rua Pudim, nº 125',
      bairro: 'Centro',
      cidade: 'Natal',
      estado: 'RN',
      adicionadoEm: '01/09/2024',
    },
    {
      id: '2',
      nome: 'Matheus',
      email: 'matheus@email.com',
      funcao: 'Dev Front-end',
      dataNascimento: '1998-07-15',
      genero: 'M',
      createdAt: '2024-09-01T10:01:00.000Z',
      cep: '98765-432',
      logradouro: 'Rua Pudim, nº 125',
      bairro: 'Centro',
      cidade: 'Natal',
      estado: 'RN',
      adicionadoEm: '05/09/2024',
    },
    {
      id: '3',
      nome: 'Cibele',
      email: 'cibele@email.com',
      funcao: 'UX/UI Designer',
      dataNascimento: '1995-10-01',
      genero: 'F',
      createdAt: '2024-09-01T10:02:00.000Z',
      cep: '98765-432',
      logradouro: 'Rua Pudim, nº 125',
      bairro: 'Centro',
      cidade: 'Natal',
      estado: 'RN',
      adicionadoEm: '04/09/2024',
    },
  ];

  private readonly avatarByGenero: Record<UserGenero, string> = {
    M: '/avatars/Masculino.png',
    F: '/avatars/Feminino.png',
  };

  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.initializeUsers();
    this.loadUsers();
  }

  getAvatarSrc(genero: UserGenero): string {
    return this.avatarByGenero[genero];
  }

  getAge(dataNascimento: string): string {
    if (!dataNascimento) return this.emptyValue;

    const birthDate = new Date(dataNascimento);

    if (Number.isNaN(birthDate.getTime())) {
      return this.emptyValue;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const hasNotHadBirthdayYet =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate());

    if (hasNotHadBirthdayYet) {
      age--;
    }

    return `${age} anos`;
  }

  onEditClick(user: UserListItem): void {
    void user; 
  }

  requestDelete(user: UserListItem): void {
    this.deleteDialogUser = user;
  }

  cancelDelete(): void {
    this.deleteDialogUser = null;
  }

  confirmDelete(): void {
    if (!this.deleteDialogUser) return;

    this.usersService.deleteUser(this.deleteDialogUser.id);
    this.deleteDialogUser = null;
    this.loadUsers();
  }

  private initializeUsers(): void {
    const users = this.usersService.getUsers();

    if (users.length === 0) {
      this.usersService.saveUsers(this.mockUsers);
    }
  }

  private loadUsers(): void {
    const users = this.usersService.getUsers();

    this.users = users
      .map((user) => this.mapUserToListItem(user))
      .reverse();
  }

  private mapUserToListItem(user: User): UserListItem {
    const fallbackDate = (user as Partial<UserListItem>).adicionadoEm;
    const formattedCreatedAt = this.formatDateBR(user.createdAt);
    const adicionadoEm =
      formattedCreatedAt !== this.emptyValue ? formattedCreatedAt : fallbackDate ?? this.emptyValue;

    return {
      ...user,
      adicionadoEm,
    };
  }

  private formatDateBR(date: string): string {
    if (!date) return this.emptyValue;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return this.emptyValue;
    }

    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
}