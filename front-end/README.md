# Top Solutions — Front-end (Avaliação)

Aplicação Angular para cadastro de usuários com autenticação simples, integração ViaCEP e persistência em `localStorage`.

## Como testar 

1. **Login:** use usuário `admin` e senha `123456` (credenciais fixas para o desafio, definidas em `AuthService`).
2. **Listagem:** após o login, você acessa a lista de usuários (`/users`).
3. **Cadastro:** em **Adicionar usuário** (`/users/create`), preencha todos os campos obrigatórios. Informe um CEP válido para o ViaCEP preencher rua, bairro, cidade e estado.
4. **Edição:** na lista, clique no ícone de editar — você será levado à **mesma tela de cadastro** com os dados preenchidos (`/users/edit/:id`).
5. **Exclusão:** use o ícone de lixeira e confirme no modal.
6. **Logout:** botão **Sair** no cabeçalho retorna ao login.

Rotas de usuários (`/users`, `/users/create`, `/users/edit/:id`) exigem autenticação; acessos diretos sem login redirecionam para `/login`.

## Estrutura 

- `src/app/core/services/` — autenticação, usuários (`localStorage`), ViaCEP
- `src/app/core/guards/` — proteção de rotas
- `src/app/pages/login/` — tela de login
- `src/app/pages/users/list-user/` — listagem (rota `/users`), modal de exclusão
- `src/app/pages/users/user-form/` — formulário compartilhado (ViaCEP, validações, salvar)
- `src/app/pages/users/create-user/` — página **Adicionar** (`/users/create`)
- `src/app/pages/users/edit-user/` — página **Editar** (`/users/edit/:id`)
