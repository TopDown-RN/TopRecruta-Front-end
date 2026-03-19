import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const VIA_CEP_URL = 'https://viacep.com.br/ws';
const CEP_LENGTH = 8;

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

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
  constructor(private readonly http: HttpClient) { }

  // Valida se o CEP possui exatamente 8 dígitos numéricos
  static isValidCepFormat(cep: string): boolean {
    const digits = cep.replace(/\D/g, '');
    return digits.length === CEP_LENGTH;
  }

  // Retorna apenas os dígitos do CEP (8 caracteres)
  static normalizeCep(cep: string): string {
    return cep.replace(/\D/g, '').slice(0, CEP_LENGTH);
  }

  // Busca endereço pelo CEP na API ViaCEP e retorna null se CEP inválido, não encontrado ou em caso de erro
  getAddress(cep: string): Observable<AddressFromCep | null> {
    const normalized = CepService.normalizeCep(cep);

    if (normalized.length !== CEP_LENGTH) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`${VIA_CEP_URL}/${normalized}/json/`).pipe(
      map((res) => {
        if (res.erro === true) {
          return null;
        }
        return {
          logradouro: res.logradouro ?? '',
          bairro: res.bairro ?? '',
          cidade: res.localidade ?? '',
          estado: res.uf ?? '',
        };
      }),
      catchError(() => of(null)),
    );
  }
}
