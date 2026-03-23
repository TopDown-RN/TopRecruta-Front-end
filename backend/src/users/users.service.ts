import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Genero, Prisma, User as PrismaUser } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type UserResponse = {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  dataNascimento: string;
  genero: Genero;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  createdAt: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserResponse[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((u) => this.toResponse(u));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.toResponse(user);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const dataNascimento = this.parseDateOnly(dto.dataNascimento);
    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome.trim(),
        email: (dto.email ?? '').trim(),
        funcao: dto.funcao,
        dataNascimento,
        genero: dto.genero,
        cep: dto.cep,
        logradouro: (dto.logradouro ?? '').trim(),
        bairro: (dto.bairro ?? '').trim(),
        cidade: dto.cidade.trim(),
        estado: dto.estado.toUpperCase(),
      },
    });
    return this.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    await this.ensureExists(id);

    const data: Prisma.UserUpdateInput = {};
    if (dto.nome !== undefined) data.nome = dto.nome.trim();
    if (dto.email !== undefined) data.email = dto.email.trim();
    if (dto.funcao !== undefined) data.funcao = dto.funcao;
    if (dto.dataNascimento !== undefined) {
      data.dataNascimento = this.parseDateOnly(dto.dataNascimento);
    }
    if (dto.genero !== undefined) data.genero = dto.genero;
    if (dto.cep !== undefined) data.cep = dto.cep;
    if (dto.logradouro !== undefined) data.logradouro = dto.logradouro.trim();
    if (dto.bairro !== undefined) data.bairro = dto.bairro.trim();
    if (dto.cidade !== undefined) data.cidade = dto.cidade.trim();
    if (dto.estado !== undefined) data.estado = dto.estado.toUpperCase();

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.toResponse(user);
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('User not found.');
    }
  }

  private parseDateOnly(isoDate: string): Date {
    const d = new Date(`${isoDate}T12:00:00.000Z`);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException('Invalid dataNascimento.');
    }
    return d;
  }

  private toResponse(user: PrismaUser): UserResponse {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      funcao: user.funcao,
      dataNascimento: user.dataNascimento.toISOString().slice(0, 10),
      genero: user.genero,
      cep: user.cep,
      logradouro: user.logradouro,
      bairro: user.bairro,
      cidade: user.cidade,
      estado: user.estado,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
