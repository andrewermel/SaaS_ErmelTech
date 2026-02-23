# 📚 Guia Completo - Swagger na BlackLanches API

## 🎯 O Que É Swagger?

Swagger (OpenAPI) é uma especificação que gera documentação interativa e automática de APIs. Na BlackLanches, você pode acessar a interface do Swagger em qualquer lugar que a aplicação estiver rodando.

---

## 🚀 Como Acessar a Documentação

### Com Docker (Recomendado)

```bash
docker compose up
```

Após iniciar, acesse: **http://localhost:3000/api-docs**

### Localmente (sem Docker)

```bash
npm install
npm run dev
```

Acesse: **http://localhost:3000/api-docs**

---

## 📖 O Que Você Encontra no Swagger

### 1️⃣ **Lista de Todos os Endpoints**

Agrupados por categoria:

- 🔐 **Auth** - Login de usuários
- 📦 **Ingredients** - Gestão de ingredientes
- 🍽️ **Portions** - Gestão de porções
- 🍔 **Snacks** - Gestão de lanches
- 👤 **Users** - Registro de usuários

### 2️⃣ **Detalhes de Cada Endpoint**

Para cada rota, você vê:

- ✅ Método HTTP (GET, POST, PUT, DELETE)
- ✅ Descrição clara do que faz
- ✅ Parâmetros obrigatórios
- ✅ Exemplo de request
- ✅ Todos os tipos de response (sucesso e erro)
- ✅ Códigos HTTP corretos (200, 201, 400, 404, etc)

### 3️⃣ **Botão "Try it out"**

Clique para testar um endpoint direto na interface:

- Preencha os parâmetros
- Clique em "Execute"
- Veja a resposta em tempo real!

---

## 💡 Exemplos de Uso

### Exemplo 1: Registrar um Novo Usuário

1. Acesse http://localhost:3000/api-docs
2. Encontre "Users" → POST /api/v1/users
3. Clique em "Try it out"
4. Preencha:
   ```json
   {
     "name": "João Silva",
     "email": "joao@example.com",
     "password": "Senha123!"
   }
   ```
5. Clique "Execute"
6. Veja a resposta com o novo usuário criado!

### Exemplo 2: Fazer Login

1. Vá para "Auth" → POST /api/v1/auth/login
2. Clique "Try it out"
3. Preencha:
   ```json
   {
     "email": "joao@example.com",
     "password": "Senha123!"
   }
   ```
4. Clique "Execute"
5. Você receberá um JWT token!

### Exemplo 3: Listar Todos os Ingredientes

1. Acesse "Ingredients" → GET /api/v1/ingredients
2. Clique "Try it out"
3. Clique "Execute"
4. Veja a lista completa de ingredientes!

---

## 🔐 Autenticação no Swagger

Alguns endpoints podem require autenticação JWT. Não se preocupe!

1. Faça login primeiro (veja Exemplo 2)
2. Copie o token recebido
3. Clique no botão "Authorize" (cadeado no topo direito)
4. Colar: `Bearer SEU_TOKEN_AQUI`
5. Clique "Authorize"
6. Agora todos seus requests incluem o token automaticamente!

---

## 📊 Estrutura de Dados

### User

```json
{
  "id": 1,
  "name": "João",
  "email": "joao@example.com",
  "createdAt": "2026-02-20T10:30:00Z"
}
```

### Ingredient

```json
{
  "id": 1,
  "name": "Pão de hamburger",
  "weightG": 50,
  "cost": "0.3500",
  "createdAt": "2026-02-20T10:30:00Z"
}
```

### Portion

```json
{
  "id": 1,
  "ingredientId": 1,
  "name": "100g de Carne",
  "weightG": 100,
  "cost": "4.5000",
  "createdAt": "2026-02-20T10:30:00Z"
}
```

### Snack (O Principal!)

```json
{
  "id": 1,
  "name": "Hambúrguer Deluxo",
  "imageUrl": "/uploads/hamburguer.jpg",
  "portions": [
    {
      "id": 1,
      "name": "100g de Carne",
      "cost": "4.5000",
      "weightG": 100
    },
    {
      "id": 2,
      "name": "2 Fatias de Queijo",
      "cost": "1.2000",
      "weightG": 20
    }
  ],
  "totalCost": "5.7000",
  "totalWeightG": 120,
  "suggestedPrice": "11.4000",
  "createdAt": "2026-02-20T10:30:00Z"
}
```

---

## 🎓 Fluxo Completo de Uso

### Passo 1: Criar Conta

```
1. Users → POST /api/v1/users
2. Preencha name, email, password
3. Receba seu novo ID de usuário
```

### Passo 2: Fazer Login

```
1. Auth → POST /api/v1/auth/login
2. Use email e password
3. Copie o token JWT recebido
4. Clique "Authorize" e cole o token
```

### Passo 3: Criar Ingredientes

```
1. Ingredients → POST /api/v1/ingredients
2. Adicione pão, carne, queijo, etc.
3. Para cada um: nome, peso em gramas, custo
```

### Passo 4: Criar Porções

```
1. Portions → POST /api/v1/portions
2. Para cada ingrediente, crie porções
   (ex: 100g de carne, 50g de carne)
3. Sistema calcula o custo automaticamente
```

### Passo 5: Montar Lanches

```
1. Snacks → POST /api/v1/snacks
2. Crie o lanche (ex: "Hambúrguer Deluxo")
3. Opcionalmente, faça upload de uma foto
```

### Passo 6: Adicionar Porções ao Lanche

```
1. Snacks → POST /api/v1/snacks/{snackId}/portions/{portionId}
2. De forma interativa, va adicionando porções
3. O sistema calcula o custo total, peso total, preço sugerido!
```

### Passo 7: Visualizar Lanche Completo

```
1. Snacks → GET /api/v1/snacks/{id}
2. Veja TODOS os cálculos automáticos
3. Saiba exatamente quanto custa seu lanche
```

---

## 🔍 Dicas Profissionais

### ✅ Boas Práticas

1. **Sempre teste localmente antes de deploy**
   - Use `docker compose up` para testar tudo
   - Teste cada endpoint no Swagger

2. **Use nomes descritivos**
   - Ingrediente: "Pão de hambúrguer branco"
   - Porção: "100g de Carne vermelha"
   - Lanche: "Hambúrguer Deluxo"

3. **Mantenha os preços atualizados**
   - Ingredientes podem variar de preço
   - Atualize regularmente para cálculos corretos

4. **Faça backup das imagens**
   - As imagens são salvas em `/public/uploads`
   - Mapeadas como volume Docker

---

## 🆘 Troubleshooting

### Swagger não aparece?

```bash
# Reinicie o docker
docker compose down
docker compose up --build
```

### Token expirou?

- Faça login novamente
- Copie o novo token
- Clique "Authorize" novamente

### Erro 404 em um endpoint?

- Verifique o ID existe
- Verifique a URL está correta
- Veja a resposta de erro

### Imagem não foi salva?

- Verifique se é PNG, JPG ou GIF
- Tamanho máximo: 5MB
- Use o formulário multipart/form-data

---

## 📱 Usa em Produção?

Você pode desabilitar o Swagger em produção:

```typescript
// src/index.ts
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec));
}
```

---

## 🤝 Contribuindo

Adicionou um novo endpoint? Documente-o com comentários JSDoc:

```typescript
/**
 * @swagger
 * /api/v1/novo-endpoint:
 *   get:
 *     summary: Descrição curta
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Sucesso
 */
```

---

**Pronto! Agora você sabe como usar o Swagger na BlackLanches!** 🎉

Qualquer dúvida, acesse a documentação oficial: https://swagger.io/
