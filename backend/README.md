# Top Solutions — API 

Back-end em **NestJS** com **Prisma** e **PostgreSQL**: autenticação JWT, CRUD de utilizadores e consulta de endereço por CEP (ViaCEP no servidor).

Todas as rotas de negócio (exceto `POST /api/auth/login` e `GET /api/health`) exigem **Bearer token**.

Os usuários são persistidos no **PostgreSQL** (Prisma). O `localStorage` não é usado para armazenamento de usuários (no front-end é usado apenas o token JWT).

### Nota sobre o requisito de `localStorage` do enunciado
O enunciado solicita que os dados cadastrados sejam armazenados no `localStorage`.

Neste projeto, a persistência dos usuários foi feita no **back-end (PostgreSQL/Prisma)** para também cobrir o bônus de persistência no servidor. O `localStorage` permanece restrito ao **token JWT** no front-end.

**Prefixo global:** `/api`

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| NestJS 11 | HTTP, módulos, validação (`class-validator`) |
| Prisma 5 | ORM, migrations |
| PostgreSQL 16 | Base de dados |
| JWT | Sessão após login |
| Axios (Nest HttpModule) | Chamadas ao ViaCEP |

---

## Pré-requisitos

- **Node.js** 20+ (recomendado, alinhado ao `Dockerfile`)
- **PostgreSQL** acessível (local, Docker ou remoto)
- Opcional: **Docker Desktop** para subir API + Postgres com um comando

---

## Variáveis de ambiente

Copie `.env.example` para `.env`.

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL. Com Docker Compose, no **host** usa `localhost:5434`; o serviço `api` dentro da rede usa `postgres:5432` (não alterar no compose). |
| `PORT` | Porta HTTP (default `3000`) |
| `CORS_ORIGIN` | Origem permitida no CORS (ex.: `http://localhost:4200` para Angular) |
| `JWT_SECRET` | Segredo para assinar tokens (**obrigatório**; use valor longo e aleatório em produção) |
| `JWT_EXPIRES_DAYS` | Validade do JWT em dias |
| `AUTH_USERNAME` | Utilizador aceite no `POST /api/auth/login` |
| `AUTH_PASSWORD` | Palavra-passe correspondente |

---

## Docker (API + Postgres)

Na pasta `backend`:

```bash
docker compose up --build
```

---

## Endpoints (resumo)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/health` | Não | Health check |
| `POST` | `/api/auth/login` | Não | Body: `{ "username", "password" }` → `{ "accessToken" }` |
| `GET` | `/api/users` | JWT | Lista utilizadores (mais recentes primeiro) |
| `GET` | `/api/users/:id` | JWT | Detalhe (UUID) |
| `POST` | `/api/users` | JWT | Criar (DTO validado; funções fixas do desafio) |
| `PATCH` | `/api/users/:id` | JWT | Atualizar |
| `DELETE` | `/api/users/:id` | JWT | Remover |
| `GET` | `/api/cep/:cep` | JWT | Endereço (8 dígitos); ViaCEP no back-end |

Header para rotas protegidas: `Authorization: Bearer <accessToken>`.

---

## Estrutura do código (pastas principais)

```
src/
  auth/          # Login, JWT, guard
  cep/           # Proxy ViaCEP
  health/        # GET /health
  prisma/        # PrismaService (módulo global)
  users/         # CRUD utilizadores
  app.setup.ts   # Prefixo api, ValidationPipe, CORS
  main.ts
prisma/
  schema.prisma
  migrations/
```

---

## Documentação NestJS

Documentação oficial: [https://docs.nestjs.com](https://docs.nestjs.com)