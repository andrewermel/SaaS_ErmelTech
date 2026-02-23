export const ingredientsSwagger = {
  paths: {
    '/api/v1/ingredients': {
      post: {
        summary: 'Criar novo ingrediente',
        description:
          'Cria um novo ingrediente com nome, peso em gramas e custo',
        tags: ['Ingredients'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'weightG', 'cost'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'Pão de hamburger',
                  },
                  weightG: {
                    type: 'integer',
                    example: 50,
                  },
                  cost: {
                    type: 'number',
                    format: 'decimal',
                    example: 0.35,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Ingrediente criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Ingredient',
                },
              },
            },
          },
          400: {
            description:
              'Dados obrigatórios faltando ou inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar todos os ingredientes',
        description:
          'Retorna uma lista de todos os ingredientes cadastrados',
        tags: ['Ingredients'],
        responses: {
          200: {
            description: 'Lista de ingredientes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Ingredient',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/ingredients/{id}': {
      get: {
        summary: 'Obter ingrediente por ID',
        description:
          'Retorna os detalhes de um ingrediente específico',
        tags: ['Ingredients'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID do ingrediente',
          },
        ],
        responses: {
          200: {
            description: 'Detalhes do ingrediente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Ingredient',
                },
              },
            },
          },
          404: {
            description: 'Ingrediente não encontrado',
          },
        },
      },
      put: {
        summary: 'Atualizar ingrediente',
        description:
          'Atualiza os dados de um ingrediente existente',
        tags: ['Ingredients'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  weightG: {
                    type: 'integer',
                  },
                  cost: {
                    type: 'number',
                    format: 'decimal',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              'Ingrediente atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Ingredient',
                },
              },
            },
          },
          404: {
            description: 'Ingrediente não encontrado',
          },
        },
      },
      delete: {
        summary: 'Deletar ingrediente',
        description: 'Remove um ingrediente do sistema',
        tags: ['Ingredients'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'Ingrediente deletado com sucesso',
          },
          404: {
            description: 'Ingrediente não encontrado',
          },
        },
      },
    },
  },
};
