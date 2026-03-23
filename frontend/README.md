# Top Solutions — Front-End 

Aplicação Angular para cadastro de usuários com:
- **Login com JWT** (token salvo em `localStorage`)
- **CRUD** via API **NestJS**
- **Consulta de CEP** via endpoint do back-end (ViaCEP executado no servidor).

## Pré-requisitos

- **API + Postgres** em execução (por padrão `http://localhost:3000/api`). Veja o [README do backend](../backend/README.md), secção **Docker (API + Postgres)**.
- Node.js compatível com o `package.json` do projeto.

## Subir tudo

1. **Back-end (Docker)** — na raiz do repositório:

   ```bash
   cd backend
   docker compose up --build
   ```

   Confirme: `curl.exe http://localhost:3000/api/health` → `{"status":"ok"}`.

2. **Front-end** — noutro terminal:

   ```bash
   cd front-end
   npm install
   npm start
   ```

   A app usa `src/environments/environment.development.ts` com `apiUrl: 'http://localhost:3000/api'`.

## Como testar

1. **Login:** `admin` / `123456` (deve coincidir com `AUTH_USERNAME` / `AUTH_PASSWORD` do back-end).
2. **Listagem:** após o login, `/users`.
3. **Cadastro:** em **Adicionar usuário**, ao informar um CEP válido, a tela busca no back-end (`GET /api/cep/:cep`).
4. **Edição / exclusão:** ícones na lista; exclusão com modal de confirmação.
5. **Logout:** **Sair** no cabeçalho.

Rotas de utilizadores exigem autenticação (`authGuard`).

### Nota sobre `localStorage` (alinhamento com o enunciado)
O enunciado pede que **os dados cadastrados dos usuários** sejam armazenados no `localStorage`.

Neste projeto, para implementar o **bônus de persistência em backend**, os usuários são persistidos no **PostgreSQL** via **Prisma** (no back-end). O `localStorage` é usado apenas para armazenar o **token JWT** (`access_token`).

Observações importantes:
- O token JWT é salvo no `localStorage` com a chave `access_token`.
- O endpoint de CEP do back-end também exige **JWT**.
- A persistência dos usuários é feita no **back-end (Prisma/Postgres)**, não em `localStorage` (além do token de autenticação).

## Estrutura (resumo)

- `src/environments/` — `apiUrl` da API
- `src/app/core/services/` — `AuthService` (JWT), `UsersService` (HTTP), `CepService` (HTTP)
- `src/app/core/interceptors/` — token Bearer e tratamento de 401
- `src/app/pages/` — login, lista, criar, editar, formulário partilhado
