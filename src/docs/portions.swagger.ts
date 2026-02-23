export const portionsSwagger = {
  paths: {
    '/api/v1/portions': {
      post: {
        summary: 'Criar nova porção',
        description:
          'Cria uma porção baseada em um ingrediente específico',
        tags: ['Portions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'ingredientId',
                  'name',
                  'weightG',
                  'cost',
                ],
                properties: {
                  ingredientId: {
                    type: 'integer',
                    example: 1,
                  },
                  name: {
                    type: 'string',
                    example: '100g de Carne',
                  },
                  weightG: {
                    type: 'integer',
                    example: 100,
                  },
                  cost: {
                    type: 'number',
                    format: 'decimal',
                    example: 4.5,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Porção criada com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Portion',
                },
              },
            },
          },
          400: {
            description: 'Dados obrigatórios faltando',
          },
          404: {
            description: 'Ingrediente não encontrado',
          },
        },
      },
      get: {
        summary: 'Listar todas as porções',
        description:
          'Retorna uma lista de todas as porções cadastradas',
        tags: ['Portions'],
        responses: {
          200: {
            description: 'Lista de porções',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Portion',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/portions/{id}': {
      get: {
        summary: 'Obter porção por ID',
        description:
          'Retorna os detalhes de uma porção específica',
        tags: ['Portions'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID da porção',
          },
        ],
        responses: {
          200: {
            description: 'Detalhes da porção',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Portion',
                },
              },
            },
          },
          404: {
            description: 'Porção não encontrada',
          },
        },
      },
      put: {
        summary: 'Atualizar porção',
        description:
          'Atualiza os dados de uma porção existente',
        tags: ['Portions'],
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
            description: 'Porção atualizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Portion',
                },
              },
            },
          },
          404: {
            description: 'Porção não encontrada',
          },
        },
      },
      delete: {
        summary: 'Deletar porção',
        description: 'Remove uma porção do sistema',
        tags: ['Portions'],
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
            description: 'Porção deletada com sucesso',
          },
          404: {
            description: 'Porção não encontrada',
          },
        },
      },
    },
  },
};
