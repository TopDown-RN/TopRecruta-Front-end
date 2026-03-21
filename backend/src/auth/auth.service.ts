import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  login(dto: LoginDto): { accessToken: string } {
    const user = this.config.get<string>('AUTH_USERNAME', 'admin');
    const pass = this.config.get<string>('AUTH_PASSWORD', '123456');

    if (dto.username !== user || dto.password !== pass) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const accessToken = this.jwt.sign({ sub: dto.username });
    return { accessToken };
  }
}
