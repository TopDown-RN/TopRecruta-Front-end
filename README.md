# **Avaliação Front-end**
Olá! Muito obrigado por participar da avaliação técnica para integrar a equipe de desenvolvimento da **Top Solutions**.

## **Objetivo**
O desafio consiste em desenvolver um sistema de cadastro de usuários, onde será possível realizar operações de **Create**, **Read**, **Update** e **Delete** (CRUD). O sistema deve utilizar a API do **ViaCep** para preenchimento automático do endereço com base no CEP informado e implementar uma funcionalidade de autenticação para acesso ao sistema.

Você receberá um protótipo no **Figma** com o layout das telas que devem ser implementadas.

[`Acesse o protótipo do Figma aqui`](https://www.figma.com/design/L7OquXSMhHA6jGsTqW72SV/Teste-pratico-Top-Solutions)

[`Acesse o site do ViaCep aqui`](https://viacep.com.br/)

## **Requisitos Funcionais**
### 1. **Tela de Login**
- Implementar uma tela de login onde o usuário precisará se autenticar para acessar o sistema de cadastro.
- **Autenticação:** O candidato pode implementar a autenticação da forma que preferir, utilizando o `Storage` ou qualquer outra solução para controle de autenticação no front-end.
- Apenas usuários autenticados poderão acessar as funcionalidades do sistema **(CRUD)**.

### 2. **Exibição de Usuários**
- Tela que exibe uma lista de usuários cadastrados com as seguintes funcionalidades, conforme mostrado no protótipo no **Figma**:
  - **Editar Usuário:** Cada usuário exibido terá um botão de "Editar". Ao clicar, o usuário será redirecionado para a tela de cadastro com os campos já preenchidos, permitindo a edição.
  - **Deletar Usuário:** Cada usuário terá um botão de "Excluir". Ao clicar, uma confirmação deve ser exibida, e após a confirmação, o cartão do usuário excluído deve sumir imediatamente.

### 3. **Cadastro de Usuário**
- Implementar uma tela com um formulário contendo os campos conforme exibidos no protótipo.
- O participante deve integrar a API do [**ViaCep**](https://viacep.com.br/) para preencher automaticamente os campos de endereço (Rua, Bairro, Cidade, Estado) ao informar um CEP válido.
- **Validação:** Todos os campos são obrigatórios e devem ter validações adequadas, como:
  - **Rua, Bairro, Cidade, Estado:** Devem ser preenchidos automaticamente pela API.
  - **CEP:** Deve ser validado usando a API.
  - **Nome:** Precisa ter um limite de caracteres.
  - **Função:** Será um Dropdown (Select Option) com opções predeterminadas:
    - Dev Back-end
    - Dev Front-end
    - Dev Full Stack
    - UX/UI Designer

## **Requisitos Técnicos**
- O projeto deve ser feito em `Vue.js 3` ou `Angular v16 ou superior`.
- **API:** O sistema deve consumir a API do ViaCep para buscar o endereço completo a partir do CEP informado.
- **LocalStorage:** Os dados cadastrados do usuário devem ser armazenados no `localStorage`.
- **Responsividade:** A aplicação deve ser responsiva e funcionar corretamente em dispositivos móveis e desktop.
- **Modal de Confirmação:** A exclusão de usuários deve ser confirmada via modal.
- **Autenticação:** O usuário precisa se autenticar para acessar as funcionalidades de **CRUD**. A implementação da autenticação pode ser flexível, desde que funcional (Storage, gerenciamento de estado ou outra solução).

### **Vue.js**
Se escolher Vue.js para este desafio:
- Use a versão **3** do Vue.js.
- Utilize a [`Composition API`](https://vuejs.org/guide/introduction.html#composition-api) para a codificação.

### **Angular**
Se escolher Angular:
- Use a versão **16 ou superior** do Angular.

## **Funcionalidades Gerais**
- Não deve ser possível acessar as telas de cadastro ([Tela 2](#2-exibição-de-usuários) e [Tela 3](#3-cadastro-de-usuário)) sem estar autenticado.
- Ao tentar acessar diretamente pela URL sem autenticação, o usuário deve ser redirecionado para a tela de Login.
- O botão de logout deve redirecionar para a tela de login, exigindo nova autenticação.
- O layout deverá seguir o protótipo do **Figma**.
- A **Idade** do usuário deve ser calculada com base na **data de nascimento**.
- A **imagem** do usuário deve refletir o **Gênero** informado.
- Não deve ser possível salvar o cadastro sem preencher todos os campos obrigatórios.
- Mensagens de erro devem ser exibidas quando houver tentativa de cadastro com campos incompletos ou inválidos.
- Ao adicionar um novo usuário, o sistema deve redirecionar para a [Tela 2](#2-exibição-de-usuários) (com o novo usuário já exibido).
- A lista de usuários deve ser exibida em ordem de cadastro, do mais recente ao mais antigo.

## **Bônus**
Essa etapa é opcional e serve como diferencial. **Não** é obrigatório realizar os passos abaixo:
- Cada usuário possui **CPF** e **Senha** para autenticação no sistema.
- Persistência dos dados em um backend.
- Tela inicial com dados estatísticos do sistema (quantidade de usuários, último usuário cadastrado, etc.).
- Filtros para localizar usuários de forma eficiente.
- Barra de rolagem ou paginação com exibição do rodapé constante.
- Criação de transições suaves entre telas.
- Utilização do [`PrimeNG (Angular)`](https://primeng.org/) ou [`PrimeVue (Vue)`](https://primevue.org/).
- Filtro no campo de funções (Dropdown).
- Destacar campos não preenchidos ou inválidos em vermelho, com mensagens de erro.

## **Instruções de Entrega**
- Faça um Fork: Crie um fork deste repositório para a sua conta pessoal no GitHub.
- Desenvolva: Implemente a solução utilizando Vue.js 3 ou Angular, realizando os commits diretamente no seu fork.
- Documente: Ao finalizar, atualize o arquivo README.md do seu repositório. Ele deve conter as instruções detalhadas de como instalar, rodar e testar a sua aplicação localmente.
- Envie: Disponibilize o link do seu repositório finalizado para a nossa equipe avaliar.

## **Instruções Finais**
- O projeto deve ser feito em `Vue.js 3` ou `Angular`, conforme indicado no enunciado.
- Utilize o repositório disponibilizado pela empresa no Github.
- Crie um Fork desse repositório
- **Prazo:** O prazo para entrega do desafio é de 7 dias após o recebimento deste enunciado.

Boa sorte e bom desenvolvimento!
