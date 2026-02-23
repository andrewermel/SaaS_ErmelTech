export const ROUTES = {
  HOME: '#/',
  LOGIN: '#/login',
  REGISTER: '#/register',
  INGREDIENTS: '#/ingredients',
  PORTIONS: '#/portions',
  SNACKS: '#/snacks',
};

export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/users',
    ME: '/protected',
  },
  INGREDIENTS: '/api/v1/ingredients',
  PORTIONS: '/api/v1/portions',
  SNACKS: '/api/v1/snacks',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
};

export const ERROR_MESSAGES = {
  LOGIN_FAILED:
    'Falha ao fazer login. Verifique suas credenciais.',
  REGISTER_FAILED: 'Falha ao registrar. Tente novamente.',
  FETCH_FAILED: 'Erro ao carregar dados.',
  CREATE_FAILED: 'Erro ao criar item.',
  UPDATE_FAILED: 'Erro ao atualizar item.',
  DELETE_FAILED: 'Erro ao deletar item.',
  UNAUTHORIZED: 'Você precisa estar autenticado.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
};

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  UPLOAD_PATH: `${API_BASE_URL}/uploads/`,
};
