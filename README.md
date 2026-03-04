# SaaS_ErmelTech — Plataforma Multi-Tenant para Gestão de Lanchonetes

Plataforma SaaS moderna para gestão de custos e cardápios de lanchonetes. Cada empresa tem dados completamente isolados, acesso via JWT com controle de permissões (RBAC) e interface intuitiva para cadastrar ingredientes, porções e lanches com cálculo automático de custos.

**Arquitetura 100% multi-tenant** — isolamento por `companyId` em todas as queries.

---

## � A História

Este projeto nasceu de um problema real.

Depois que nossa loja de móveis **(JP Móveis)** faliu após a enchente que atingiu Eldorado do Sul/RS em 2024, minha família começou a vender lanches para recomeçar. Mas havia um problema crítico: não tínhamos **controle real de custos, ingredientes e margem de lucro**.

Como desenvolvedor, fiz o que qualquer dev faria: criei uma plataforma interna para organizar:

- Ingredientes
- Porções (combinações de ingredientes)
- Lanches (combinações de porções)
- Cálculo automático de custo e margem

O projeto começou simples, mas cresceu naturalmente. Outras pessoas que vendem pastel na rua, churrasquinho ou trabalham com lanches começaram a pedir para usar também.

**Foi aí que transformei a aplicação em um SaaS multi-tenant** — cada vendedor agora tem total isolamento de dados, autenticação segura com JWT e controle de permissões (RBAC).

**Lição aprendida:** Tecnologia faz diferença quando resolve um problema real. Este é um exemplo disso. ✅

---

## �🚀 Quick Start (Docker)

```bash
git clone <seu-repo>
cd SaaS_ErmelTech

# Build e inicia tudo (backend, frontend, postgres)
docker compose up --build

# Ou em background
docker compose up --build -d
```

**URLs:**

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Swagger**: http://localhost:3001/api-docs
- **Prometheus**: http://localhost:9090 (métricas de performance)
- **Grafana**: http://localhost:3000 (dashboard de visualização)
  > Para rodar os testes localmente, veja a seção [🧪 Testes](#-testes) abaixo.

---

## 📖 Como Usar (Fluxo SaaS Completo)

### 1. Registrar Empresa + Usuário Owner

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@minha-lanchonete.com",
    "password": "senha123",
    "companyName": "Lanchonete do João"
  }'
```

**Resposta:**

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@minha-lanchonete.com"
  },
  "company": {
    "id": 1,
    "name": "Lanchonete do João",
    "slug": "lanchonete-do-joao"
  },
  "role": "OWNER"
}
```

**O que acontece internamente:**

- Nova `Company` criada
- Novo `User` criado
- Relação `UserCompany` criada com role `OWNER`
- JWT retornado com `companyId`, `userId`, `role`

---

### 2. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@minha-lanchonete.com",
    "password": "senha123"
  }'
```

---

### 3. Usar o Token para Operações

Todas as requisições autenticadas exigem:

```bash
Authorization: Bearer <seu-token>
```

---

### 4. Criar Ingredientes

```bash
curl -X POST http://localhost:3001/api/v1/ingredients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pão de Hambúrguer",
    "weightG": 50,
    "cost": 0.50
  }'
```

**Nota**: O ingrediente é salvo automaticamente com `companyId` do seu JWT. Cada empresa só vê seus próprios ingredientes.

---

### 5. Criar Porções (combinações de ingredientes)

```bash
curl -X POST http://localhost:3001/api/v1/portions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hambúrguer",
    "ingredientId": 1,
    "weightG": 100,
    "cost": 3.50
  }'
```

---

### 6. Criar Lanches (combinação de porções)

```bash
curl -X POST http://localhost:3001/api/v1/snacks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hambúrguer Clássico"
  }'
```

---

### 7. Adicionar Porções ao Lanche

```bash
curl -X POST http://localhost:3001/api/v1/snacks/1/portions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "portionId": 1,
    "quantity": 1
  }'
```

**Resultado**: O sistema calcula automaticamente:

- Peso total do lanche
- Custo total (ingredientes)
- Margem de lucro sugerida

---

### 8. Convidar Usuários para Empresa (Role-Based Access)

**OWNER ou ADMIN podem criar usuários:**

```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer <token-owner>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria",
    "email": "maria@lanchonete.com",
    "password": "senha456",
    "role": "ADMIN"
  }'
```

**Roles disponíveis:**

- `OWNER`: Acesso total + gerenciar usuários
- `ADMIN`: Acesso total a ingredientes/porções/lanches
- `EMPLOYEE`: Visualizar apenas (read-only)

---

## 🔐 Segurança e Isolamento Multi-Tenant

### Isolamento de Dados por `companyId`

Toda query de leitura/escrita filtra automaticamente por `companyId` do token:

```typescript
// Exemplo: listar ingredientes da minha empresa
GET / api / v1 / ingredients;
// Server executa: WHERE companyId = req.user.companyId

// Resultado: apenas ingredientes da sua empresa, nunca de outras
```

### Matriz de Permissões (RBAC)

| Ação                | OWNER | ADMIN | EMPLOYEE |
| ------------------- | ----- | ----- | -------- |
| Listar ingredientes | ✅    | ✅    | ✅       |
| Criar ingrediente   | ✅    | ✅    | ❌       |
| Editar ingrediente  | ✅    | ✅    | ❌       |
| Deletar ingrediente | ✅    | ✅    | ❌       |
| Gerenciar usuários  | ✅    | ❌    | ❌       |

Middleware `authorizeRole()` em cada rota protegida garante que apenas usuários com role permitida consigam acessar.

---

## 🏗️ Arquitetura

### Fluxo de uma Requisição

```
1. Cliente (Frontend/Postman)
   ↓
2. Route (userRoutes.ts) — Define o endpoint
   ↓
3. Middleware (authenticateJWT) — Extrai userId, companyId, role do token
   ↓
4. Middleware (authorizeRole) — Valida se role tem permissão
   ↓
5. Controller — Valida entrada (req.body)
   ↓
6. Service — Executa lógica (cálculos, queries)
   ↓
7. Prisma — Acessa BD + filtra por companyId
   ↓
8. Response — Retorna dados apenas da sua empresa
```

### Estrutura de Diretórios

```
SaaS_ErmelTech/
├── src/                           # Backend (Node.js + TypeScript)
│   ├── controllers/               # Validação + orquestração
│   ├── services/                  # Lógica de negócio
│   ├── routes/                    # Definição de endpoints
│   ├── middlewares/               # JWT + RBAC
│   ├── helpers/                   # Validações reutilizáveis
│   ├── tests/                     # Testes de integração
│   │   └── helpers/               # createTestTenant, etc
│   ├── lib/                       # Prisma client singleton
│   └── index.ts                   # Express app
│
├── prisma/
│   ├── schema.prisma              # Modelos (Company, User, Snack, etc)
│   └── migrations/                # Histórico de mudanças no BD
│
├── frontend/
│   ├── src/
│   │   ├── contexts/              # AuthContext (JWT, companyId, role)
│   │   ├── pages/                 # Register, Login, Dashboard, MenuPage
│   │   ├── components/            # UI reutilizável
│   │   ├── hooks/                 # usePermission (verifica role)
│   │   └── services/              # Chamadas à API
│   └── package.json
│
├── public/uploads/                # Imagens dos lanches
├── Dockerfile                     # Backend container
├── docker-compose.yml             # Postgres + Postgres-test + Backend + Frontend
├── jest.config.cjs                # Configuração de testes (carrega .env.test)
├── .env.test                      # Variáveis para testes locais (não commitado)
├── Swagger.yaml                   # Documentação OpenAPI
└── README.md
```

---

## 🗄️ Banco de Dados (Prisma)

### Models Principais

**Company** — Representa uma empresa (lanchonete)

```
id, name, slug, email, phone
```

**User** — Usuário (pode estar em múltiplas empresas)

```
id, name, email, password
```

**UserCompany** — Relação N:N com role (OWNER/ADMIN/EMPLOYEE)

```
userId, companyId, role
```

**Ingredient** — Ingredientes da empresa

```
id, companyId, name, weightG, cost
```

**Portion** — Porção de um ingrediente

```
id, companyId, ingredientId, name, weightG, cost
```

**Snack** — Lanche (combinação de porções)

```
id, companyId, name, imageUrl
```

**SnackPortion** — Relação entre Snack e Portion

```
snackId, portionId, quantity
```

---

## 🧪 Testes

Cobertura completa de isolamento multi-tenant e RBAC.

> Os testes de integração usam um banco PostgreSQL **dedicado e separado** (`postgres-test` na porta 5433), para nunca contaminar os dados de desenvolvimento.

### Primeira vez (setup)

```bash
# Sobe o banco de teste e aplica todas as migrations
npm run test:setup
```

### Execução diária (Docker já rodando)

```bash
npm test
```

### Variáveis de ambiente para testes

O arquivo `.env.test` (criado localmente, não commitado) configura a conexão com o banco de teste:

```env
DATABASE_URL=postgresql://test:test@localhost:5433/test_db
JWT_SECRET=test-secret-key-for-ci
NODE_ENV=test
```

**Testes incluem:**

- ✅ Autenticação (login, registro)
- ✅ Isolamento de dados por `companyId` (multi-tenant)
- ✅ Verificação de permissões por role (RBAC)
- ✅ CRUD de ingredientes, porções, lanches
- ✅ Cálculo de custos

Resultado esperado: **39 testes passando**

> **CI/CD**: o pipeline do GitHub Actions sobe automaticamente um PostgreSQL de serviço para os testes — nenhuma configuração extra necessária.

---

## 📈 Monitoramento e Observabilidade

A plataforma conta com stack completo de monitoramento de performance e saúde da aplicação.

### Prometheus (Coleta de Métricas)

Endpoint de métricas exposto em:

```bash
GET /metrics
```

**Métricas coletadas:**

- Requisições HTTP por rota, método e status code
- Tempo de resposta (latência) das APIs
- Memória e CPU do processo Node.js
- GC (Garbage Collection) events

Acesse o dashboard do Prometheus em **http://localhost:9090** para consultar métricas em tempo real.

### Grafana (Dashboard Visual)

Visualize as métricas do Prometheus com dashboards customizados.

- **URL**: http://localhost:3000
- **Usuário padrão**: admin
- **Senha padrão**: admin

**Como configurar Grafana:**

1. Acesse http://localhost:3000
2. Vá em **Data Sources** → **Add Data Source**
3. Selecione **Prometheus**
4. URL: `http://prometheus:9090`
5. Clique em **Save & Test**

Agora você pode criar dashboards para visualizar:

- Taxa de requisições (RPS)
- Latência P50, P95, P99
- Taxa de erro (5xx)
- Uso de memória e CPU

---

- **Node.js 20 (Alpine)** — Runtime JavaScript/TypeScript
- **Express 5** — Framework web
- **TypeScript** — Tipagem estática
- **Prisma ORM v6.19.2** — Acesso a PostgreSQL com type-safety
- **PostgreSQL 16** — Banco de dados relacional
- **JWT (jsonwebtoken)** — Autenticação segura
- **bcryptjs** — Hashing de senhas
- **Multer** — Upload de imagens
- **prom-client** — Exportar métricas para Prometheus

### Observabilidade

- **Prometheus** — Coleta e armazenamento de métricas
- **Grafana** — Visualização de dashboards

### Frontend

- **React 18** — Biblioteca UI
- **Vite** — Build tool moderna
- **Tailwind CSS** — Utilidades CSS
- **Custom CSS** — Tema amarelo/vermelho/preto
- **jwt-decode** — Decodificar JWT no client

### Ferramentas de Desenvolvimento

- **Jest** — Testes unitários
- **Supertest** — Testes de API
- **ESLint** — Linter
- **TypeScript Compiler** — Verificação de tipos
- **Git** — Controle de versão

---

## 🔧 Instalação e Execução (Sem Docker)

### Pré-requisitos

- Node.js 18+
- PostgreSQL 16+
- npm ou yarn

### Passos

#### 1. Clone e instale dependências

```bash
git clone <seu-repo>
cd SaaS_ErmelTech

# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

#### 2. Configure ambiente

Crie `.env` na raiz (desenvolvimento):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/saas_ermeltech"
JWT_SECRET="sua_chave_super_segura_aqui_mude_em_producao"
PORT=3000
NODE_ENV=development
```

Crie `.env.test` na raiz (testes — aponta para banco separado):

```env
DATABASE_URL=postgresql://test:test@localhost:5433/test_db
JWT_SECRET=test-secret-key-for-ci
NODE_ENV=test
```

#### 3. Configure o banco de dados

```bash
# Criar banco (PostgreSQL)
createdb saas_ermeltech

# Executar migrações
npx prisma migrate dev
```

#### 4. Inicie

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**URLs:**

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🔒 Segurança (Produção)

### Antes de fazer deploy:

- [ ] Altere `JWT_SECRET` para valor criptograficamente seguro
- [ ] Configure a aplicação com HTTPS (certificado SSL/TLS)
- [ ] Use variáveis de ambiente para credenciais (nunca commitar `.env`)
- [ ] Configure rate limiting em endpoints públicos
- [ ] Ative backups automáticos do PostgreSQL
- [ ] Use WAF (Web Application Firewall) se possível
- [ ] Monitore logs de erro e segurança

### Exemplo (Docker com variáveis seguras):

```bash
docker compose up -d \
  -e JWT_SECRET="super_seguro_123" \
  -e DATABASE_URL="postgresql://prod_user:prod_pass@db.prod.com:5432/saas_ermeltech"
```

---

## 🚀 Deployment

### Docker Compose (desenvolvimento/staging)

```bash
docker compose up --build -d
docker compose logs -f backend
```

### Kubernetes (produção)

Configure um Ingress, ConfigMaps (variáveis), Secrets (credenciais) e faça deploy dos serviços.

---

## 🤝 Contribuição

Pull requests são bem-vindos!

**Antes de PR:**

1. Rode os testes localmente:

   ```bash
   npm test
   ```

2. Verifique que `docker compose up --build` inicia tudo sem erros

3. Documente novos endpoints em `Swagger.yaml`

4. Escreva testes para novas features

5. Use commits descritivos:
   ```
   feat: add export feature to Snacks API
   ```

---

## 📄 Licença

MIT License — veja [LICENSE](LICENSE) para detalhes.

---

## ❓ Suporte

Encontrou um bug? Abra uma [issue](../../issues).

Tem dúvidas? Consulte a [documentação OpenAPI](http://localhost:3000/api-docs).
