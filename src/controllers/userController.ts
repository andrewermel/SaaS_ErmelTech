import { Request, Response } from 'express';
import { handleError } from '../helpers/errorHandler.js';
import {
    VALIDATION_MESSAGES,
    validateEmail,
    validatePassword
} from '../helpers/validationPatterns.js';
import {
    sendValidationError,
    validateRequired,
} from '../helpers/validators.js';
import { UserService } from '../services/userService.js';

const userService = new UserService();

/**
 * 👤 UserController
 *
 * Responsável por:
 * - Validar entrada do usuário
 * - Chamar UserService para lógica de negócio
 * - Retornar resposta HTTP apropriada
 */

/**
 * POST /api/v1/users
 * Criar novo usuário
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;

  // Validar campos obrigatórios
  const nameError = validateRequired(name, 'Name');
  if (nameError) return sendValidationError(nameError, res);

  const emailError = validateRequired(email, 'Email');
  if (emailError)
    return sendValidationError(emailError, res);

  const passwordError = validateRequired(
    password,
    'Password'
  );
  if (passwordError)
    return sendValidationError(passwordError, res);

  // Validar formato de email
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ error: VALIDATION_MESSAGES.INVALID_EMAIL });
  }

  // Validar força da senha
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: VALIDATION_MESSAGES.WEAK_PASSWORD,
    });
  }

  try {
    const user = await userService.create(
      name,
      email,
      password
    );
    return res.status(201).json(user);
  } catch (error) {
    return handleError(error, 'Error creating user.', res);
  }
};
