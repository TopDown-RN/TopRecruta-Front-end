import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { CreateUserBody } from '../utils/user-form-payload.util';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
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
