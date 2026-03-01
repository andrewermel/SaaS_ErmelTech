# SaaS_ErmelTech — Plataforma SaaS para Gestão de Lanchonetes

Este repositório contém a plataforma SaaS para gestão de lanchonetes, projetada para operar em ambiente multi-tenant (cada cliente/empresa tem dados isolados). O projeto já inclui backend em Node.js/TypeScript, frontend em React (Vite) e testes automatizados.

Visão rápida:

- Multi-tenant: isolamento por `companyId` em todas as queries
- Autenticação: JWT com claims `userId`, `companyId`, `role`
- Autorização: middleware RBAC (`OWNER`, `ADMIN`, `EMPLOYEE`)
- Desenvolvimento e execução por Docker Compose

---

## Recursos Principais

- Isolamento multi-tenant por `companyId`
- Autenticação via JWT e extração de `companyId` no frontend
- Matriz de permissões (RBAC) aplicada no backend e refletida no frontend (`usePermission`)
- API documentada em OpenAPI (`Swagger.yaml`)
- Testes de integração cobrindo isolamento e autorização

---

## Arquitetura

Estrutura resumida:

```
├── backend/        # Node.js + TypeScript + Prisma
├── frontend/       # React + Vite
├── docker-compose.yml
├── Dockerfile      # backend
├── Swagger.yaml    # documentação OpenAPI
└── prisma/         # migrations + schema
```

---

## Quickstart (local, Docker)

Pré-requisitos: Docker e Docker Compose instalados.

1) Build e subir os containers:

```bash
docker compose up --build
```

2) Rodar em background:

```bash
docker compose up --build -d
```

3) Ver logs do backend:

```bash
docker compose logs -f backend
```

4) Testes (no container backend):

```bash
docker compose exec backend npm test
```

Ports expostas (padrão):

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

---

## API & Documentação

A documentação OpenAPI está em `Swagger.yaml` neste repositório. Abra em [Swagger UI](https://swagger.io/tools/swagger-ui/) ou importe no Postman/Insomnia.

Pontos importantes:

- Endpoints protegidos exigem header `Authorization: Bearer <token>`
- O registro (`/auth/register`) agora aceita `companyName` para criar a empresa do cliente

---

## Testes

- Atualmente a suíte de testes automatizados cobre autenticação, controllers e cenários SaaS (isolamento + RBAC).
- Para executar localmente (via Docker):

```bash
docker compose exec backend npm test
```

---

## Contribuição

Pull requests são bem-vindos. Antes de abrir PR, execute os testes e garanta que o `docker compose up --build` funcione localmente.

Sugestões:

- Escreva testes para novas features
- Documente endpoints adicionados no `Swagger.yaml`

---

## Segurança e Produção

- Troque o `JWT_SECRET` para um valor seguro em produção
- Use HTTPS e configure variáveis de ambiente via secrets no deploy
- Configure backups para o banco de dados PostgreSQL

---

## Licença

Este projeto está licenciado sob MIT.

---

Se quiser, ajusto o README com o nome comercial do SaaS e dados de contato/empresa — me diga o nome que deseja exibir.
- **Prisma ORM** - ORM moderno para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Multer** - Upload de imagens

### Frontend

- **React** - Biblioteca para interfaces de usuário
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Custom CSS** - Estilização personalizada com tema amarelo/vermelho/preto

### Ferramentas de Desenvolvimento

- **Jest** - Testes unitários
- **ESLint** - Linter para código JavaScript/TypeScript
- **Git** - Controle de versão

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 14 ou superior)
- [Git](https://git-scm.com/)
- Um editor de código (recomendamos [VS Code](https://code.visualstudio.com/))

---

## � Como Iniciar com Docker (Recomendado!)

**Não quer instalar Node.js e PostgreSQL?** Use Docker! ⚡

### Pré-requisitos Docker:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado

### Em 3 passos:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/API_BLACKLANCHES.git
cd API_BLACKLANCHES

# 2. Construa as imagens (primeira vez)
docker compose build

# 3. Inicie tudo
docker compose up
```

**Pronto!** Tudo rodando:

- 🎨 Frontend: http://localhost:5173
- 🔙 Backend: http://localhost:3000
- 🐘 PostgreSQL: localhost:5432

✅ **Para próximas vezes, apenas execute:** `docker compose up`

> ⚠️ **Atenção:** A senha deve ter mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial. Ex: `Senha123!`

### 📚 Acessar Documentação da API (Swagger)

Após iniciar com `docker compose up`, acesse a documentação interativa **no backend (porta 3000)**:

```
🔗 http://localhost:3000/api-docs
```

**Lá você pode:**

- ✅ Ver todos os endpoints disponíveis
- ✅ Testar requisições diretamente no navegador (botão "Try it out")
- ✅ Ver exemplos de respostas
- ✅ Entender o schema de cada request/response
- ✅ Copiar tokens JWT e reutilizar em outros endpoints
- ✅ Upload de imagens e testes complexos

**URLs do Sistema:**

| Serviço             | Porta    | URL                                |
| ------------------- | -------- | ---------------------------------- |
| 🎨 Frontend         | 5173     | http://localhost:5173              |
| 📚 **Swagger Docs** | **3000** | **http://localhost:3000/api-docs** |
| 🔙 Backend API      | 3000     | http://localhost:3000/api/v1       |
| 🐘 PostgreSQL       | 5432     | localhost:5432                     |

---

## 🚀 Como Instalar e Executar (Sem Docker)

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/API_BLACKLANCHES.git
cd API_BLACKLANCHES
```

### 2️⃣ Configure o Banco de Dados

Crie um banco de dados PostgreSQL:

```bash
# No terminal do PostgreSQL
createdb blacklanches
```

### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/blacklanches"

# JWT
JWT_SECRET="sua_chave_secreta_super_segura_aqui"

# Servidor
PORT=3000
```

### 4️⃣ Instale as Dependências

```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd frontend
npm install
cd ..
```

### 5️⃣ Execute as Migrações do Banco de Dados

```bash
npx prisma migrate dev
```

### 6️⃣ Inicie o Projeto

```bash
# Inicia backend e frontend simultaneamente
npm run dev:all
```

**Pronto!** 🎉

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

---

## 📱 Como Usar o BlackLanches

### 🧪 Opção 1: Testar via Swagger (Recomendado para Testes)

1. Acesse **http://localhost:3000/api-docs** no seu navegador
2. Vá para **"Users" → "POST /api/v1/users" → "Try it out"**
3. Preencha e teste criar usuário
4. Vá para **"Auth" → "POST /api/v1/auth/login" → "Try it out"** para fazer login
5. Copie o token recebido
6. Clique no botão 🔒 **"Authorize"** e cole o token
7. Agora pode testar todos endpoints com autenticação!

### 🎨 Opção 2: Usar Interface Gráfica (Frontend)

1. Acesse **http://localhost:5173** no seu navegador
2. Clique em **"Criar conta"**
3. Preencha seu nome, email e senha
4. Faça login com suas credenciais

### 2. Cadastrando Ingredientes

![Ingredientes](https://img.shields.io/badge/Passo_1-Ingredientes-daa520?style=for-the-badge)

1. No menu inicial, clique em **"Ingredientes"**
2. Preencha os dados:
   - **Nome**: Ex: "Carne Bovina"
   - **Peso (em gramas)**: Ex: 1000 (para 1kg)
   - **Custo (R$)**: Ex: 25.00
3. Clique em **"Criar Ingrediente"**

💡 **Dica**: O peso deve ser em gramas. Se comprou 1kg, digite 1000g.

### 3. Criando Porções

![Porções](https://img.shields.io/badge/Passo_2-Por%C3%A7%C3%B5es-daa520?style=for-the-badge)

1. Vá para **"Porções"**
2. Preencha:
   - **Nome da porção**: Ex: "Hambúrguer 120g"
   - **Escolha o ingrediente**: Ex: "Carne Bovina"
   - **Peso da porção (em gramas)**: Ex: 120
3. Clique em **"Criar Porção"**

✨ **O sistema calcula automaticamente o custo da porção baseado no ingrediente!**

### 4. Montando seus Lanches

![Lanches](https://img.shields.io/badge/Passo_3-Lanches-daa520?style=for-the-badge)

1. Acesse **"Lanches"**
2. Preencha o nome do lanche: Ex: "X-Bacon"
3. Adicione uma foto (opcional)
4. **Adicione as porções**:
   - Selecione uma porção (Ex: "Hambúrguer 120g")
   - Clique em **"➕ Adicionar"**
   - Adicione todas as porções necessárias
5. Veja o resumo em tempo real:
   - Total de porções
   - Peso total
   - **Custo total** 💰
   - **Preço sugerido de venda** (com margem de lucro) 💵
6. Clique em **"✨ Criar Lanche"**

### 5. Visualizando e Editando

- **Ver detalhes**: Clique no ícone 📋 ao lado do lanche
- **Editar**: Clique no ícone ✏️ para modificar
- **Deletar**: Clique no ícone 🗑️ para remover

---

## 💡 Dicas de Uso

### 📊 Como Interpretar os Custos

- **Custo Total**: Quanto você gasta para fazer 1 unidade do lanche
- **Preço Sugerido**: O sistema sugere vender por 2x o custo (100% de lucro)
- **Você pode vender por mais ou menos** dependendo do seu mercado!

### 🎯 Exemplo Prático

**Ingredientes:**

- Carne (1kg) = R$ 25,00
- Queijo (1kg) = R$ 35,00
- Pão (10 unidades) = R$ 8,00

**Porções:**

- Hambúrguer 120g = R$ 3,00
- Queijo 40g = R$ 1,40
- Pão 100g = R$ 0,80

**Lanche X-Bacon:**

- 1x Hambúrguer 120g = R$ 3,00
- 2x Queijo 40g = R$ 2,80
- 1x Pão 100g = R$ 0,80
- **Custo Total: R$ 6,60**
- **Preço Sugerido: R$ 13,20**

Se você vender por R$ 15,00, terá **R$ 8,40 de lucro** por lanche! 💰

---

## 📁 Estrutura do Projeto

```
API_BLACKLANCHES/
├── frontend/              # Aplicação React + Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── contexts/     # Context API (autenticação)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # Serviços de API
│   │   ├── utils/        # Funções utilitárias
│   │   └── constants/    # Constantes e configurações
│   └── public/           # Arquivos estáticos
├── src/                  # Backend Node.js/TypeScript (MVC)
│   ├── controllers/      # 🎮 Orquestração de requisições
│   │   ├── authController.ts
│   │   ├── ingredientController.ts
│   │   ├── portionController.ts
│   │   ├── snackController.ts
│   │   └── userController.ts ✨
│   ├── services/         # 💼 Lógica de negócio
│   │   ├── ingredientService.ts
│   │   ├── portionService.ts
│   │   ├── snackService.ts
│   │   └── userService.ts ✨
│   ├── routes/           # 🗺️ Definição de endpoints
│   │   ├── authRoutes.ts
│   │   ├── ingredientRoutes.ts
│   │   ├── portionRoutes.ts
│   │   ├── snackRoutes.ts
│   │   └── userRoutes.ts ✨
│   ├── middlewares/      # 🔒 Autenticação e upload
│   │   ├── authenticateJWT.ts
│   │   └── upload.ts
│   ├── helpers/          # 🛠️ Funções utilitárias
│   │   ├── errorHandler.ts
│   │   ├── validators.ts
│   │   └── validationPatterns.ts ✨ (centralizado!)
│   ├── config/           # ⚙️ Configurações da aplicação
│   │   └── swagger.ts    # 📚 Configuração Swagger/OpenAPI
│   ├── docs/             # 📚 Documentação Swagger/OpenAPI
│   │   ├── auth.swagger.ts
│   │   ├── ingredients.swagger.ts
│   │   ├── portions.swagger.ts
│   │   ├── snacks.swagger.ts
│   │   └── users.swagger.ts
│   ├── types/            # 📘 Tipos TypeScript compartilhados
│   │   ├── entities.ts
│   │   ├── errors.ts
│   │   └── jwt.ts
│   ├── lib/              # 📦 Configurações externas
│   │   └── prisma.ts
│   └── index.ts          # 🚀 Entrada da aplicação
├── prisma/               # 🗄️ Schema e migrações
│   ├── schema.prisma     # Modelo do banco de dados
│   └── migrations/       # Histórico de migrações
├── public/uploads/       # 🖼️ Imagens dos lanches
└── package.json          # Dependências do projeto
```

---

## 🔌 Endpoints da API

> 📚 **Para explorar todos os endpoints de forma interativa, acesse:**
>
> - **Em Docker**: `http://localhost:3000/api-docs` (após `docker compose up`)
> - **Em local**: `http://localhost:3000/api-docs` (após `npm run dev`)
>
> A documentação Swagger/OpenAPI permite testar todos os endpoints diretamente no navegador! ✨

### Autenticação

- `POST /api/v1/auth/login` - Login (retorna JWT)
- `POST /api/v1/users` - Criar novo usuário
- `GET /protected` - Rota protegida (validar token)

### Ingredientes

- `POST /api/v1/ingredients` - Criar ingrediente
- `GET /api/v1/ingredients` - Listar ingredientes
- `GET /api/v1/ingredients/:id` - Obter ingrediente
- `PUT /api/v1/ingredients/:id` - Atualizar ingrediente
- `DELETE /api/v1/ingredients/:id` - Deletar ingrediente

### Porções

- `POST /api/v1/portions` - Criar porção
- `GET /api/v1/portions` - Listar porções
- `GET /api/v1/portions/:id` - Obter porção
- `PUT /api/v1/portions/:id` - Atualizar porção
- `DELETE /api/v1/portions/:id` - Deletar porção

### Lanches

- `POST /api/v1/snacks` - Criar lanche
- `GET /api/v1/snacks` - Listar lanches com totais
- `GET /api/v1/snacks/:id` - Obter lanche com totais
- `POST /api/v1/snacks/:snackId/portions/:portionId` - Adicionar porção ao lanche
- `DELETE /api/v1/snacks/:snackId/portions/:portionId` - Remover porção do lanche
- `DELETE /api/v1/snacks/:id` - Deletar lanche

---

## 🏗️ Arquitetura MVC

O backend segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

### 📊 Fluxo de uma Requisição

```
1. Cliente (Frontend/Postman)
   ↓
2. Route (userRoutes.ts) - Define o endpoint
   ↓
3. Controller (userController.ts) - Valida entrada (req.body)
   ↓
4. Service (userService.ts) - Executa lógica de negócio
   ↓
5. Model (Prisma) - Acessa/modifica banco de dados
   ↓
6. Response - Retorna dados ao cliente
```

### 📚 Responsabilidades de Cada Camada

| Camada          | Responsabilidade                | Exemplo                                      |
| --------------- | ------------------------------- | -------------------------------------------- |
| **Routes**      | Mapear URLs para controladores  | `POST /api/v1/users` → `createUser()`        |
| **Controllers** | Validar entrada, chamar service | Validar email, chamar `userService.create()` |
| **Services**    | Lógica de negócio, BD           | Criptografar senha, criar usuário no DB      |
| **Models**      | Definir estrutura de dados      | Schema Prisma define fields da tabela `user` |
| **Helpers**     | Validações reutilizáveis        | `validateEmail()`, `validatePassword()`      |

### ✨ Validações Centralizadas

Todas as validações estão em um único arquivo [src/helpers/validationPatterns.ts](src/helpers/validationPatterns.ts):

```typescript
// Email e Senha com regex forte
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Mensagens de erro padrão
export const VALIDATION_MESSAGES = { ... };

// Funções reutilizáveis
export const validateEmail = (email: string): boolean => { ... };
export const validatePassword = (password: string): boolean => { ... };
```

**Benefícios:**

- ✅ Uma única fonte de verdade para validações
- ✅ Fácil de manutenção (mudar regex em um lugar)
- ✅ Reutilizável em qualquer controller/service

### 📚 Documentação Swagger/OpenAPI

A documentação da API é organizada em arquivos separados dentro de [src/docs/](src/docs/):

```
src/docs/
├── auth.swagger.ts       # 🔐 Endpoints de autenticação
├── ingredients.swagger.ts # 🥘 Endpoints de ingredientes
├── portions.swagger.ts    # 🍽️ Endpoints de porções
├── snacks.swagger.ts      # 🍔 Endpoints de lanches
└── users.swagger.ts       # 👤 Endpoints de usuários
```

**Como funciona:**

1. **Documentação Separada**: Cada módulo tem seu próprio arquivo de documentação (`.swagger.ts`)
2. **Rotas Limpas**: Os arquivos de rotas (`src/routes/`) não contêm comentários de documentação
3. **Merge Automático**: [src/config/swagger.ts](src/config/swagger.ts) combina todas as documentações em uma especificação OpenAPI 3.0
4. **UI Interativa**: A interface Swagger UI permite testar todos os endpoints diretamente

**Resultado:** Código limpo + Documentação centralizada + API bem documentada! 🎯

---

## 🧪 Executando os Testes

```bash
# Testes do backend
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

**Cobertura atual: 25/25 testes passando ✅**

---

## 🚀 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar servidor em desenvolvimento
npm run dev

# Executar testes
npm test

# Testes em modo watch (auto-reload)
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Validar TypeScript
npx tsc --noEmit

# Validar ESLint
npx eslint src/**/*.ts

# Formatar código (se configurado)
npm run format
```

---

## 🐛 Solução de Problemas

### Problema: "Erro ao conectar ao banco de dados"

**Solução**: Verifique se o PostgreSQL está rodando e se a `DATABASE_URL` no `.env` está correta.

### Problema: "Cannot find module"

**Solução**: Execute `npm install` novamente no diretório raiz e na pasta frontend.

### Problema: "Port 3000 already in use"

**Solução**: Mude a porta no arquivo `.env` ou encerre o processo que está usando a porta 3000.

### Problema: "Token inválido"

**Solução**: Faça logout e login novamente. O token pode ter expirado.

### Problema: "Valores zerados nos lanches"

**Solução**: Certifique-se de que as porções foram adicionadas antes de salvar o lanche. Recarregue a página para ver os valores atualizados.

### Problema: "Cannot GET /api-docs"

**Solução**: Certifique-se de que:

1. O backend está rodando (`docker compose up` ou `npm run dev`)
2. Você está acessando a URL correta: `http://localhost:3000/api-docs` (não 5173)
3. A pasta `src/docs/` e arquivo `src/config/swagger.ts` existem e estão bem importados em `src/index.ts`
4. Se estiver em Docker, execute `docker compose build backend` para reconstruir a imagem

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Este projeto foi criado para ajudar famílias empreendedoras, e sua ajuda pode fazer a diferença.

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap de Melhorias Futuras

- [ ] Relatórios de vendas e lucro
- [ ] Controle de estoque de ingredientes
- [ ] Histórico de vendas diárias
- [ ] Exportação de dados para Excel
- [ ] Aplicativo mobile (React Native)
- [ ] Modo escuro
- [ ] Multi-idiomas (Português, Espanhol, Inglês)
- [ ] Integração com impressora de comandas
- [ ] Dashboard com gráficos de lucro
- [ ] Gestão de fornecedores

---

## � Arquitetura SaaS - Multi-tenant

### V2.0 - Transformação para SaaS

A partir da **versão 2.0**, BlackLanches evoluiu para uma arquitetura **multi-tenant**. Isto significa que múltiplas lanchonetes podem usar a mesma plataforma simultaneamente, com **isolamento total de dados**.

### Isolamento Multi-tenant

```
┌─────────────────────────────────────┐
│      BlackLanches SaaS v2.0         │
├─────────────────────────────────────┤
│                                     │
│  Empresa A          Empresa B        │
│  (Lanches João)    (Hambúrg Plus)   │
│                                     │
│  Seus dados:       Seus dados:      │
│  ✓ Ingredientes    ✓ Ingredientes   │
│  ✓ Porções         ✓ Porções        │
│  ✓ Lanches         ✓ Lanches        │
│  ✓ Usuários        ✓ Usuários       │
│                                     │
│  ✗ Compartilhado: NÃO ✗             │
│                                     │
└─────────────────────────────────────┘
```

### Tabela de Relacionamento `UserCompany`

Cada usuário pode ter múltiplos roles em múltiplas empresas:

```
User: João Silva
├─ Lanches João (companyId=1) → OWNER
└─ Hambúrg Plus (companyId=2) → ADMIN
```

### Matriz de Permissões (RBAC)

| Role | Criar | Editar | Deletar | Ler |
|------|-------|--------|---------|-----|
| **OWNER** | ✅ | ✅ | ✅ | ✅ |
| **ADMIN** | ✅ | ✅ | ❌ | ✅ |
| **EMPLOYEE** | ❌ | ❌ | ❌ | ✅ |

### Schema de Multi-tenancy

Todas as tabelas de dados têm uma coluna `companyId` que garante isolamento:

```typescript
// Ingrediente
model Ingredient {
  id        Int      @id @default(autoincrement())
  name      String
  weightG   Decimal
  cost      Decimal
  companyId Int      @not_null  // 🔒 Isolamento
  company   Company  @relation(fields: [companyId], references: [id])
  @@index([companyId])           // 🚀 Performance
}
```

### Fluxo de Autenticação SaaS

```
1. REGISTRO
   └─ /auth/register
      └─ name, email, password, companyName
      └─ Cria: User + Company + UserCompany(role=OWNER)

2. LOGIN
   └─ /auth/login
      └─ email, password
      └─ Retorna JWT com: userId, email, companyId, role

3. ACESSO À API
   └─ Header: Authorization: Bearer <token>
   └─ Backend valida: Token + companyId + role
   └─ Middleware authorizeRole verifica permissões

4. ISOLAMENTO
   └─ Service filtra por companyId
   └─ Nenhum dado de outrem é acessível
```

### Testes de Multi-tenancy

✅ **39 testes passando**, incluindo:

#### Isolamento de Dados (Fase 7.1)
```
✓ TenantB não vê ingredientes de TenantA na lista
✓ TenantA vê seu próprio ingrediente
✓ TenantB não consegue deletar ingrediente de TenantA (404)
```

#### Autorização por Role (Fase 7.2)
```
✓ OWNER passa em autorização para CREATE
✓ ADMIN passa em autorização para CREATE
✓ EMPLOYEE recebe 403 para CREATE
✓ OWNER passa em autorização para DELETE
✓ ADMIN recebe 403 para DELETE
✓ EMPLOYEE recebe 403 para DELETE
```

### Segurança

- ✅ Dados filtrados por `companyId` em TODAS as queries
- ✅ JWT contém `companyId` para validação
- ✅ Middleware `authorizeRole` valida permissões
- ✅ Testes de isolamento executados automaticamente
- ⚠️ JWT_SECRET deve ser seguro e rotacionado regulamente
- ⚠️ HTTPS obrigatório em produção

### Escalabilidade

A arquitetura multi-tenant permite:
- Múltiplas empresas em uma instância
- Dados persistidos em PostgreSQL 16
- Índices em `companyId` para otimizar queries
- Fácil adição de novos tenants sem deploy

---

## 📚 Documentação OpenAPI (Swagger)

Veja o arquivo `Swagger.yaml` para documentação completa da API. A documentação inclui:

- Todos os endpoints
- Schemas de request/response
- Exemplos de uso
- Códigos de status HTTP
- Autenticação Bearer JWT

Abra em Swagger UI, Postman ou Insomnia para visualizar interativamente.

---

## 💻 Frontend SaaS

### Autenticação + JWT Decode

```javascript
// AuthContext.jsx
import { jwtDecode } from 'jwt-decode';

const login = async (email, password) => {
  const data = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);

  // Decodificar JWT para extrair companyId + role
  const decoded = jwtDecode(data.token);
  setUser({
    userId: decoded.userId,
    email: decoded.email,
    companyId: decoded.companyId,
    role: decoded.role,
  });
};
```

### Hook usePermission()

```javascript
// hooks/usePermission.js
export function usePermission() {
  const { user } = useAuth();

  return {
    canCreate: ['OWNER', 'ADMIN'].includes(user?.role),
    canEdit:   ['OWNER', 'ADMIN'].includes(user?.role),
    canDelete: user?.role === 'OWNER',
  };
}

// Uso nos componentes
const { canCreate, canDelete } = usePermission();
{canCreate && <button>Novo Ingrediente</button>}
{canDelete && <button>Deletar</button>}
```

### Header com Info da Empresa

```javascript
// App.jsx
{isAuthenticated && user && (
  <div className="header-info">
    <span className="company-info">
      🏢 {user.companyId}
      <span className="role-badge">{user.role}</span>
    </span>
  </div>
)}
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 💖 Agradecimentos

Este projeto é dedicado à minha família, que encontrou forças para recomeçar após a enchente. Que o BlackLanches ajude muitas outras famílias a prosperarem e alcançarem seus sonhos.

**Para todas as famílias empreendedoras: não desistam! 💪**

---

## 📞 Contato

Se você tem dúvidas, sugestões ou quer compartilhar sua história de uso do BlackLanches, entre em contato!

---

<div align="center">

**Feito com ❤️ por uma família que acredita no recomeço**

![Família](https://img.shields.io/badge/Para_Fam%C3%ADlias-Empreendedoras-daa520?style=for-the-badge)
![Recomeço](https://img.shields.io/badge/Recomeço-Sempre_Possível-success?style=for-the-badge)
![SaaS](https://img.shields.io/badge/SaaS-Multi_Tenant-success?style=for-the-badge)

⭐ Se este projeto ajudou você, considere dar uma estrela!

</div>

---

**Última atualização**: 01 de março de 2026  
**Versão**: 2.0.0 (SaaS)  
**Testes**: 39 ✅ | Arquitetura: Multi-tenant ✅
