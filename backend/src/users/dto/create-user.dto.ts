import { Genero } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

const FUNCOES = [
  'Dev Back-end',
  'Dev Front-end',
  'Dev Full Stack',
  'UX/UI Designer',
] as const;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([...FUNCOES])
  funcao!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dataNascimento must be YYYY-MM-DD',
  })
  dataNascimento!: string;

  @IsEnum(Genero)
  genero!: Genero;

  @IsString()
  @Matches(/^\d{8}$/)
  cep!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logradouro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bairro?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cidade!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  estado!: string;
}
