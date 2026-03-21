import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type AddressFromCep = {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
};

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

const VIA_CEP_BASE = 'https://viacep.com.br/ws';

@Injectable()
export class CepService {
  private readonly logger = new Logger(CepService.name);

  constructor(private readonly http: HttpService) {}

  static normalizeCep(cep: string): string {
    return cep.replace(/\D/g, '').slice(0, 8);
  }

  async lookup(cep: string): Promise<AddressFromCep | null> {
    const digits = CepService.normalizeCep(cep);
    if (digits.length !== 8) {
      return null;
    }

    const url = `${VIA_CEP_BASE}/${digits}/json/`;

    try {
      return await firstValueFrom(
        this.http.get<ViaCepResponse>(url).pipe(
          map((axiosRes) => {
            const data = axiosRes.data;
            if (data.erro === true) {
              return null;
            }
            return {
              logradouro: data.logradouro ?? '',
              bairro: data.bairro ?? '',
              cidade: data.localidade ?? '',
              estado: data.uf ?? '',
            };
          }),
          catchError((err: unknown) => {
            this.logger.warn(`ViaCEP falhou para ${digits}: ${String(err)}`);
            return of(null);
          }),
        ),
      );
    } catch {
      return null;
    }
  }
}
