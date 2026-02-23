/**
 * 📋 Padrões de Validação Centralizados
 *
 * Arquivo único para todas as regex e validações
 * Facilita manutenção e reutilização em toda a aplicação
 */

/** Email: valida formato básico de email */
export const EMAIL_REGEX =
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Senha: validação forte
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial (@$!%*?&)
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/** Mensagens de erro padrão */
export const VALIDATION_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format.',
  WEAK_PASSWORD:
    'Password must have at least 8 characters, 1 uppercase, 1 number and 1 special character (@$!%*?&).',
  INVALID_WEIGHT: 'Weight must be greater than 0.',
  INVALID_COST: 'Cost must be greater than 0.',
};

/** Funções de validação reutilizáveis */
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.toLowerCase().trim());
};

export const validatePassword = (
  password: string
): boolean => {
  return PASSWORD_REGEX.test(password);
};

export const validateWeight = (weight: number): boolean => {
  return weight > 0;
};

export const validateCost = (cost: number): boolean => {
  return cost > 0;
};
