import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { User, UserGenero } from '../../models/user.model';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

// Usuário com campo opcional de data formatada para exibição (Adicionado em)
type UserListItem = User & {
  adicionadoEm?: string;
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, DeleteModalComponent, EditModalComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  // Valor exibido quando não há data ou idade válida
  private readonly emptyValue = '—';

  // Lista de usuários exibida na tela 
  users: UserListItem[] = [];
  // Usuário selecionado para exclusão; quando preenchido, o modal de confirmação é exibido
  deleteDialogUser: UserListItem | null = null;
  // Usuário selecionado para edição; quando preenchido, o modal de edição é exibido
  editDialogUser: UserListItem | null = null;

  // Caminho dos avatares conforme o gênero
  private readonly avatarByGenero: Record<UserGenero, string> = {
    M: '/avatars/Masculino.png',
    F: '/avatars/Feminino.png',
  };

  constructor(private readonly usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Retorna a URL do avatar conforme o gênero do usuário
  getAvatarSrc(genero: UserGenero): string {
    return this.avatarByGenero[genero];
  }

  // Calcula e retorna a idade em anos a partir da data de nascimento (formato ISO ou DD/MM/AAAA)
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

  // Ação do botão editar (não implementada)
  onEditClick(user: UserListItem): void {
    this.editDialogUser = user;
  }

  // Abre o modal de confirmação de exclusão para o usuário informado
  requestDelete(user: UserListItem): void {
    this.deleteDialogUser = user;
  }

  // Fecha o modal de exclusão sem remover o usuário
  cancelDelete(): void {
    this.deleteDialogUser = null;
  }

  // Confirma a exclusão, remove o usuário do localStorage e recarrega a lista
  confirmDelete(): void {
    if (!this.deleteDialogUser) return;

    this.usersService.deleteUser(this.deleteDialogUser.id);
    this.deleteDialogUser = null;
    this.loadUsers();
  }

  cancelEdit(): void {
    this.editDialogUser = null;
  }

  confirmEdit(updatedUser: User): void {
    this.usersService.updateUser(updatedUser);
    this.editDialogUser = null;
    this.loadUsers();
  }

  // Carrega usuários do localStorage e exibe em ordem decrescente de criação 
  private loadUsers(): void {
    const users = this.usersService.getUsers();

    this.users = users
      .map((user) => this.mapUserToListItem(user))
      .reverse();
  }

  // Converte User em UserListItem, preenchendo adicionadoEm (data de criação formatada em DD/MM/AAAA)
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

  // Formata uma data (string ISO ou similar) para DD/MM/AAAA. Retorna emptyValue se inválida
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