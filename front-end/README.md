# Top Solutions — Front-end (Angular)

Aplicação Angular para cadastro de usuários: login com **JWT**, CRUD contra a **API Nest** e consulta de CEP pela **API do back-end** (ViaCEP no servidor).

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

   A app usa `environment.development.ts` com `apiUrl: 'http://localhost:3000/api'`.

## Como testar

1. **Login:** `admin` / `123456` (deve coincidir com `AUTH_USERNAME` / `AUTH_PASSWORD` do back-end).
2. **Listagem:** após o login, `/users`.
3. **Cadastro:** **Adicionar usuário** — CEP dispara a busca na API (`GET /api/cep/:cep` com JWT).
4. **Edição / exclusão:** ícones na lista; exclusão com modal de confirmação.
5. **Logout:** **Sair** no cabeçalho.

Rotas de utilizadores exigem autenticação (`authGuard`).

## Estrutura (resumo)

- `src/environments/` — `apiUrl` da API
- `src/app/core/services/` — `AuthService` (JWT), `UsersService` (HTTP), `CepService` (HTTP)
- `src/app/core/interceptors/` — token Bearer e tratamento de 401
- `src/app/pages/` — login, lista, criar, editar, formulário partilhado
