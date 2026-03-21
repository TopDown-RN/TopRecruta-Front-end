import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { CreateUserBody } from '../utils/user-form-payload.util';

/** Garante array: o back devolve `User[]`, mas proxies/tools podem expor um único objeto. */
function normalizeUserList(body: unknown): User[] {
  if (Array.isArray(body)) {
    return body as User[];
  }
  if (body !== null && typeof body === 'object' && 'id' in body) {
    return [body as User];
  }
  return [];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[] | User>(this.baseUrl).pipe(map(normalizeUserList));
  }

  getUserById(id: string): Observable<User | null> {
    if (!id) {
      return of(null);
    }
    return this.http
      .get<User>(`${this.baseUrl}/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createUser(body: CreateUserBody): Observable<User> {
    return this.http.post<User>(this.baseUrl, body);
  }

  updateUser(id: string, body: CreateUserBody): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, body);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
