-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL DEFAULT '',
    "funcao" VARCHAR(64) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "genero" "Genero" NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "logradouro" VARCHAR(255) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
