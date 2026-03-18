import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

// Chave usada para persistir os usuários no `localStorage`
const USERS_KEY = 'users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  getUsers(): User[] {
    const storedUsers = localStorage.getItem(USERS_KEY);

    if (!storedUsers) {
      return [];
    }

    try {
      // Faz parse do JSON e valida se o retorno é um array
      const parsedUsers: unknown = JSON.parse(storedUsers);

      if (!Array.isArray(parsedUsers)) {
        return [];
      }

      return parsedUsers
        .map((item) => this.normalizeUser(item))
        .filter((user): user is User => user !== null);
    } catch {
      return [];
    }
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  getUserById(id: string): User | undefined {
    if (!id) {
      return undefined;
    }

    return this.getUsers().find((user) => user.id === id);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  deleteUser(id: string): void {
    if (!id) {
      return;
    }

    const users = this.getUsers().filter((user) => user.id !== id);
    this.saveUsers(users);
  }

  private normalizeUser(raw: unknown): User | null {
    // Normaliza um item vindo do `localStorage` garantindo que o shape do objeto
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const user = raw as Record<string, unknown>;

    return {
      ...user,
      id: this.getString(user['id']) || this.generateId(),
      nome: this.getString(user['nome']),
      email: this.getString(user['email']),
      funcao: this.getString(user['funcao']),
      dataNascimento: this.getString(user['dataNascimento']),
      genero: this.getGenero(this.getString(user['genero'])),
      createdAt: this.getString(user['createdAt']) || new Date().toISOString(),
      cep: this.getString(user['cep']),
      logradouro: this.getString(user['logradouro']),
      bairro: this.getString(user['bairro']),
      cidade: this.getString(user['cidade']),
      estado: this.getString(user['estado']),
    } as User;
  }

  private getString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private getGenero(value: string): 'M' | 'F' {
    return value === 'F' ? 'F' : 'M';
  }

  private generateId(): string {
    if (crypto?.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}