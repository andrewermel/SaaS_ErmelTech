export const snacksSwagger = {
  paths: {
    '/api/v1/snacks': {
      post: {
        summary: 'Criar novo lanche',
        description:
          'Cria um novo lanche com nome e opcionalmente uma imagem',
        tags: ['Snacks'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'Hambúrguer Deluxo',
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                    description:
                      'Arquivo de imagem (PNG, JPG, GIF)',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Lanche criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Snack',
                },
              },
            },
          },
          400: {
            description: 'Dados obrigatórios faltando',
          },
        },
      },
      get: {
        summary: 'Listar todos os lanches',
        description:
          'Retorna uma lista de todos os lanches com cálculos automáticos de custo',
        tags: ['Snacks'],
        responses: {
          200: {
            description:
              'Lista de lanches com custos calculados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Snack',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/snacks/{id}': {
      get: {
        summary: 'Obter lanche por ID',
        description:
          'Retorna os detalhes de um lanche específico com custos calculados',
        tags: ['Snacks'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID do lanche',
          },
        ],
        responses: {
          200: {
            description: 'Detalhes do lanche com cálculos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Snack',
                },
              },
            },
          },
          404: {
            description: 'Lanche não encontrado',
          },
        },
      },
      delete: {
        summary: 'Deletar lanche',
        description:
          'Remove um lanche do sistema (cascata - remove associações)',
        tags: ['Snacks'],
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
            description: 'Lanche deletado com sucesso',
          },
          404: {
            description: 'Lanche não encontrado',
          },
        },
      },
    },
    '/api/v1/snacks/{snackId}/portions/{portionId}': {
      post: {
        summary: 'Adicionar porção ao lanche',
        description:
          'Associa uma porção a um lanche (adiciona um ingrediente ao lanche)',
        tags: ['Snacks'],
        parameters: [
          {
            in: 'path',
            name: 'snackId',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID do lanche',
          },
          {
            in: 'path',
            name: 'portionId',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID da porção a ser adicionada',
          },
        ],
        responses: {
          201: {
            description: 'Porção adicionada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    snackId: {
                      type: 'integer',
                    },
                    portionId: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Porção já está associada a este lanche',
          },
          404: {
            description: 'Lanche ou porção não encontrado',
          },
        },
      },
      delete: {
        summary: 'Remover porção do lanche',
        description:
          'Remove a associação de uma porção de um lanche',
        tags: ['Snacks'],
        parameters: [
          {
            in: 'path',
            name: 'snackId',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID do lanche',
          },
          {
            in: 'path',
            name: 'portionId',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID da porção a ser removida',
          },
        ],
        responses: {
          200: {
            description: 'Porção removida com sucesso',
          },
          404: {
            description: 'Associação não encontrada',
          },
        },
      },
    },
  },
};
