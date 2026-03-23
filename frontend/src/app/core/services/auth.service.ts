import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => localStorage.setItem(TOKEN_KEY, res.accessToken)),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
