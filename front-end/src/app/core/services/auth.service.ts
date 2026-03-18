import { Injectable } from '@angular/core';

const AUTH_KEY = 'auth';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = '123456';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Tenta fazer login com as credenciais informadas.
   * Para este teste, aceita apenas usuário "admin" e senha "123456".
   */
  login(username: string, password: string): boolean {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  /**
   * Verifica se o usuário está autenticado (existe valor no localStorage).
   */
  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'true';
  }

  /**
   * Remove a autenticação e limpa o localStorage.
   */
  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
}
