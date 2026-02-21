# 🚀 Painel Vulkan - Gerenciamento de Domínios

O Painel Vulkan é uma aplicação frontend moderna desenvolvida para gerenciamento de domínios e contas de e-mail profissional.

A aplicação simula um ecossistema real consumindo uma API mockada através de interceptors do Axios e gerenciamento de estado remoto com React Query.

---

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as ferramentas mais exigidas pelo mercado:

- React (Vite)
- TypeScript (Tipagem forte e segurança)
- TailwindCSS (Estilização utilitária e responsiva)
- React Query (Gerenciamento de cache e estado do servidor)
- React Hook Form (Manipulação eficiente de formulários)
- Zod (Validação de schemas e tipagem de dados)
- Axios (Cliente HTTP com interceptors)
- React Hot Toast (Notificações de feedback visual)

---

## 🏗️ Arquitetura e Decisões Técnicas

A estrutura foi pensada para ser escalável e de fácil manutenção, seguindo princípios de Clean Architecture:

### 🔹 Service Layer
Toda a lógica de comunicação com a API está isolada em serviços dedicados, desacoplando a UI das requisições.

### 🔹 Custom Hooks
Encapsulamento de lógicas complexas de busca de dados para componentes mais limpos e reutilizáveis.

### 🔹 Schema Validation
Validações de formulários centralizadas em schemas reutilizáveis do Zod.

### 🔹 Auth Context
Gerenciamento global do estado de autenticação e proteção de rotas privadas.

### 🔹 Mock API
Implementação de um adaptador customizado no Axios para interceptar chamadas e simular um backend real com persistência em memória.

---

## ⚙️ Funcionalidades Implementadas

### 🔐 Autenticação

- Fluxo de login com validação de credenciais
- Persistência de token falso no localStorage
- Proteção de rotas (redirecionamento automático se deslogado)

---

### 🌐 Domínios

- Listagem de domínios disponíveis com useQuery
- Feedback de carregamento (Skeleton Loading)
- Tratamento de erros

---

### 📧 Gerenciamento de Contas (CRUD)

- Listagem: Visualização de contas vinculadas ao domínio
- Criação: Cadastro de novas contas com validação de senha e storage
- Exclusão: Remoção de contas com solicitação de confirmação
- Bloqueio: Alteração de status (Ativo/Bloqueado) via Toggle
- Armazenamento: Atualização dinâmica do limite de storage da conta
- Alteração de Senha: Modal dedicado para redefinição de segurança

---

## 🚀 Como rodar o projeto

### 1️⃣ Clone o repositório

git clone https://github.com/gustavohenriqueT/DesafioJuniorReact.git

### 2️⃣ Instale as dependências

npm install

### 3️⃣ Inicie o servidor de desenvolvimento

npm run dev

---

## 🔑 Credenciais de Acesso (Mock)

Email: admin@vulkan.com  
Senha: 123456 (mínimo de 6 caracteres)

---

## 📝 Critérios de Sucesso Atendidos

- Invalidação de cache correta com invalidateQueries após cada mutação
- Injeção automática do Bearer Token via Interceptor do Axios
- UI responsiva e amigável com TailwindCSS
- Feedback instantâneo via Toasts para todas as ações do usuário

---

## 👨‍💻 Desenvolvido por

Gustavo Henrique
