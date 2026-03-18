import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

const USERS_KEY = 'users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed as User[];
    } catch {
      return [];
    }
  }

  saveUsers(users: User[]): void {
    // Salva os usuários no localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

