import swaggerJsdoc from 'swagger-jsdoc';
import { authSwagger } from '../docs/auth.swagger.js';
import { ingredientsSwagger } from '../docs/ingredients.swagger.js';
import { portionsSwagger } from '../docs/portions.swagger.js';
import { snacksSwagger } from '../docs/snacks.swagger.js';
import { usersSwagger } from '../docs/users.swagger.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🍔 ErmelTech SaaS API',
      version: '1.0.0',
      description:
        'API SaaS de gestão de custos para lanchonetes. Sistema multi-tenant que calcula automaticamente o custo real, peso e preço sugerido de venda para cada lanche.',
      contact: {
        name: 'ErmelTech Support',
        email: 'support@ermeltech.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'http://backend:3000',
        description: 'Docker Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT Authorization header using the Bearer scheme.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário',
            },
            name: {
              type: 'string',
              description: 'Nome do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
        },
        Ingredient: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do ingrediente',
            },
            name: {
              type: 'string',
              description:
                'Nome do ingrediente (ex: pão, carne, queijo)',
            },
            weightG: {
              type: 'integer',
              description: 'Peso em gramas',
            },
            cost: {
              type: 'string',
              description: 'Custo do ingrediente em reais',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
            },
          },
        },
        Portion: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID da porção',
            },
            ingredientId: {
              type: 'integer',
              description: 'ID do ingrediente associado',
            },
            name: {
              type: 'string',
              description:
                'Nome da porção (ex: 100g de carne)',
            },
            weightG: {
              type: 'integer',
              description: 'Peso da porção em gramas',
            },
            cost: {
              type: 'string',
              description: 'Custo da porção em reais',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
            },
          },
        },
        Snack: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do lanche',
            },
            name: {
              type: 'string',
              description:
                'Nome do lanche (ex: Hambúrguer Deluxo)',
            },
            imageUrl: {
              type: 'string',
              nullable: true,
              description: 'URL da imagem do lanche',
            },
            totalCost: {
              type: 'string',
              description:
                'Custo total calculado do lanche',
            },
            totalWeightG: {
              type: 'integer',
              description: 'Peso total em gramas',
            },
            suggestedPrice: {
              type: 'string',
              description:
                'Preço sugerido de venda (custo × 2)',
            },
            portions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Portion',
              },
              description: 'Porções que compõem o lanche',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticação de usuários',
      },
      {
        name: 'Ingredients',
        description: 'Gestão de ingredientes',
      },
      {
        name: 'Portions',
        description: 'Gestão de porções',
      },
      {
        name: 'Snacks',
        description: 'Gestão de lanches',
      },
      {
        name: 'Users',
        description: 'Gestão de usuários',
      },
    ],
    paths: {
      ...authSwagger.paths,
      ...ingredientsSwagger.paths,
      ...portionsSwagger.paths,
      ...snacksSwagger.paths,
      ...usersSwagger.paths,
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
