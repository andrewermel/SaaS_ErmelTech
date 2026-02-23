export const usersSwagger = {
  paths: {
    '/api/v1/users': {
      post: {
        summary: 'Registrar novo usuário',
        description:
          'Cria um novo usuário no sistema com nome, email e senha',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'João Silva',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'joao@example.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'senha123',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                    },
                    name: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Dados obrigatórios faltando ou email já existe',
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
    },
  },
};
