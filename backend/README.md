# API — TopRecruta (avaliação Top Solutions)

Back-end em **NestJS** com **Prisma** e **PostgreSQL**: autenticação JWT, CRUD de utilizadores e consulta de endereço por CEP (ViaCEP no servidor). Todas as rotas de negócio (exceto login e health) exigem **Bearer token**.

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

Copie `.env.example` para `.env` e ajuste.

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (ver `docker-compose.yml` se usar Docker) |
| `PORT` | Porta HTTP (default `3000`) |
| `CORS_ORIGIN` | Origem permitida no CORS (ex.: `http://localhost:4200` para Angular) |
| `JWT_SECRET` | Segredo para assinar tokens (**obrigatório**; use valor longo e aleatório em produção) |
| `JWT_EXPIRES_DAYS` | Validade do JWT em dias |
| `AUTH_USERNAME` | Utilizador aceite no `POST /api/auth/login` |
| `AUTH_PASSWORD` | Palavra-passe correspondente |

Não commite o ficheiro `.env`.

---

## Desenvolvimento local (sem Docker da API)

1. Instalar dependências e gerar o cliente Prisma:

   ```bash
   npm install
   npx prisma generate
   ```

2. Garantir que o Postgres está a correr e que `DATABASE_URL` no `.env` está correto.

3. Aplicar migrations:

   ```bash
   npm run prisma:migrate
   ```

   (ou `npx prisma migrate dev` com nome da migration)

4. Arrancar em modo watch:

   ```bash
   npm run start:dev
   ```

5. Verificar saúde da API:

   ```bash
   curl http://localhost:3000/api/health
   ```

---

## Docker (API + Postgres)

Na pasta `backend`:

```bash
docker compose up --build
```

- **API:** `http://localhost:3000/api`
- **Health:** `GET http://localhost:3000/api/health` → `{"status":"ok"}`
- **Postgres:** `localhost:5432` — utilizador, palavra-passe e base: `toprecruta`

Ao iniciar, o contentor da API executa `prisma migrate deploy` antes do Nest.

Podes definir `JWT_SECRET` e `CORS_ORIGIN` num ficheiro `.env` ao lado de `docker-compose.yml` ou exportar no terminal.

### Problemas comuns (Docker)

- **`exec format error` (Postgres):** arquitetura da imagem não coincide com o CPU. Remove imagens antigas (`docker rmi postgres:16`) e volta a subir; em último caso define `platform: linux/amd64` ou `linux/arm64` nos serviços, conforme o teu PC.
- **`exec /docker-entrypoint.sh: no such file` (API):** normalmente **CRLF** no script no Windows; o `Dockerfile` já normaliza com `sed`. Faz rebuild sem cache na imagem da API se necessário: `docker compose build --no-cache api`.

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

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Desenvolvimento com reload |
| `npm run build` | Compilação TypeScript |
| `npm run start:prod` | Executa `dist/main.js` (após `build`) |
| `npm run lint` | ESLint |
| `npm run test` | Testes unitários Jest |
| `npm run test:e2e` | Testes e2e |
| `npm run prisma:generate` | Gera cliente Prisma |
| `npm run prisma:migrate` | Migrations em desenvolvimento |
| `npm run prisma:deploy` | Aplica migrations (CI/produção) |

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

---

## Licença

Projeto privado — avaliação técnica. Código gerado com Nest CLI sujeito à licença do próprio Nest onde aplicável.
