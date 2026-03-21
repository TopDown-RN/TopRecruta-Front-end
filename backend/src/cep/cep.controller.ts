import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CepService } from './cep.service';

@Controller('cep')
@UseGuards(JwtAuthGuard)
export class CepController {
  constructor(private readonly cep: CepService) {}

  /** CEP com 8 dígitos (apenas números ou com máscara). */
  @Get(':cep')
  async getByCep(@Param('cep') cep: string) {
    const address = await this.cep.lookup(cep);
    if (!address) {
      throw new NotFoundException('CEP não encontrado ou inválido.');
    }
    return address;
  }
}
