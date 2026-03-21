import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

const CEP_LENGTH = 8;

export interface AddressFromCep {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class CepService {
  constructor(private readonly http: HttpClient) {}

  static isValidCepFormat(cep: string): boolean {
    const digits = cep.replace(/\D/g, '');
    return digits.length === CEP_LENGTH;
  }

  static normalizeCep(cep: string): string {
    return cep.replace(/\D/g, '').slice(0, CEP_LENGTH);
  }

  /** Consulta ViaCEP via API Nest (JWT). */
  getAddress(cep: string): Observable<AddressFromCep | null> {
    const normalized = CepService.normalizeCep(cep);

    if (normalized.length !== CEP_LENGTH) {
      return of(null);
    }

    return this.http
      .get<AddressFromCep>(`${environment.apiUrl}/cep/${normalized}`)
      .pipe(catchError(() => of(null)));
  }
}
