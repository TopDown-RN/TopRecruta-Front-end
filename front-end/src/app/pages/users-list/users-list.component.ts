import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { User, UserGenero } from '../../models/user.model';

type UserListItem = User & {
  // Campo temporário para simular o layout do passo 2
  adicionadoEm?: string;
};

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  users: UserListItem[] = [];

  // Mock hardcoded para simulação do passo 2
  private readonly mockUsers: UserListItem[] = [
    {
      id: 'u-1',
      nome: 'Anderson',
      email: 'anderson@email.com',
      funcao: 'Dev Full Stack',
      dataNascimento: '1985-08-20',
      genero: 'M',
      cep: '98765-432',
      logradouro: 'Rua Pudim, nº 125',
      bairro: 'Centro',
      cidade: 'Natal',
      estado: 'RN',
      adicionadoEm: '01/09/2024',
    },
    {
      id: 'u-2',
      nome: 'Matheus',
      email: 'matheus@email.com',
      funcao: 'Dev Front-end',
      dataNascimento: '1998-07-15',
      genero: 'M',
      cep: '98765-432',
      logradouro: 'Rua Pudim, nº 125',
      bairro: 'Centro',
      cidade: 'Natal',
      estado: 'RN',
      adicionadoEm: '01/09/2024',
    },
    {
      id: 'u-3',
      nome: 'Cibele',
      email: 'cibele@email.com',
      funcao: 'UX/UI Designer',
      dataNascimento: '1995-10-01',
      genero: 'F',
      cep: '98765-432',
      logradouro: 'Rua Pudim, nº 125',
      bairro: 'Centro',
      cidade: 'Natal',
      estado: 'RN',
      adicionadoEm: '01/09/2024',
    },
  ];

  private readonly avatarSrcByGenero: Record<UserGenero, string> = {
    M: '/avatars/Masculino.png',
    F: '/avatars/Feminino.png',
  };

  constructor(
    private readonly usersService: UsersService,
  ) {}

  ngOnInit(): void {
    // Simulação do passo 2 
    this.seedMockUsersIfEmpty();
    this.loadUsers();
  }

  private seedMockUsersIfEmpty(): void {
    const existing = this.usersService.getUsers();
    if (existing.length > 0) return;

    // Mock com o campo extra 'adicionadoEm' para suportar o layout
    this.usersService.saveUsers(this.mockUsers);
  }

  private loadUsers(): void {
    // Mapeia os dados salvos para incluir 'adicionadoEm' (quando existir)
    // Mantém a lista tipada e evita casts inseguros.
    const users = this.usersService.getUsers().map((u) => {
      const maybeAdicionadoEm = (u as { adicionadoEm?: string }).adicionadoEm;
      return {
        ...u,
        adicionadoEm: maybeAdicionadoEm,
      };
    });

    this.users = users.reverse();
  }

  getAvatarSrc(genero: UserGenero): string {
    return this.avatarSrcByGenero[genero];
  }

  getAge(dataNascimento: string): string {
    if (!dataNascimento) return '—';
    const d = new Date(dataNascimento);
    if (Number.isNaN(d.getTime())) return '—';

    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return `${age} anos`;
  }
}

