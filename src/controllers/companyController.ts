import { Request, Response } from 'express';
import { handleError } from '../helpers/errorHandler.js';
import {
  sendValidationError,
  validateRequired,
} from '../helpers/validators.js';
import {
  validateEmail,
  validatePassword,
  VALIDATION_MESSAGES,
} from '../helpers/validationPatterns.js';
import { CompanyService } from '../services/companyService.js';

const companyService = new CompanyService();

/**
 * POST /api/v1/companies
 * Criar nova empresa (o usuário autenticado vira OWNER)
 */
export const createCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email } = req.body;
  const userId = req.user!.userId;

  const nameError = validateRequired(name, 'Name');
  if (nameError) return sendValidationError(nameError, res);

  try {
    const company = await companyService.create(
      name,
      userId,
      email
    );
    return res.status(201).json(company);
  } catch (error) {
    return handleError(
      error,
      'Error creating company.',
      res
    );
  }
};

/**
 * GET /api/v1/companies/:id
 * Buscar empresa por ID
 */
export const getCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id)
    return res.status(400).json({ error: 'Invalid ID.' });

  try {
    const company = await companyService.findById(
      Number.parseInt(id)
    );
    if (!company)
      return res
        .status(404)
        .json({ error: 'Company not found.' });
    return res.json(company);
  } catch (error) {
    return handleError(
      error,
      'Error fetching company.',
      res
    );
  }
};

/**
 * PUT /api/v1/companies/:id
 * Atualizar empresa
 */
export const updateCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id)
    return res.status(400).json({ error: 'Invalid ID.' });

  const { name, email, phone } = req.body;

  try {
    const company = await companyService.update(
      Number.parseInt(id),
      { name, email, phone }
    );
    return res.json(company);
  } catch (error) {
    return handleError(
      error,
      'Error updating company.',
      res
    );
  }
};

/**
 * GET /api/v1/companies/:id/members
 * Listar membros da empresa
 */
export const getMembers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id)
    return res.status(400).json({ error: 'Invalid ID.' });

  try {
    const members = await companyService.findMembers(
      Number.parseInt(id)
    );
    return res.json(members);
  } catch (error) {
    return handleError(
      error,
      'Error fetching members.',
      res
    );
  }
};

/**
 * POST /api/v1/companies/:id/invite
 * Convidar usuário para a empresa com role especificada.
 * Apenas OWNER pode convidar (validado no middleware)
 */
export const inviteMember = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;
  const { email, role } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ error: 'Invalid company ID.' });

  const emailError = validateRequired(email, 'Email');
  if (emailError)
    return sendValidationError(emailError, res);

  const roleError = validateRequired(role, 'Role');
  if (roleError) return sendValidationError(roleError, res);

  if (!['ADMIN', 'EMPLOYEE'].includes(role)) {
    return res
      .status(400)
      .json({ error: 'Role must be ADMIN or EMPLOYEE.' });
  }

  try {
    const userCompany = await companyService.inviteMember(
      Number.parseInt(id),
      email,
      role
    );
    return res.status(201).json(userCompany);
  } catch (error) {
    return handleError(
      error,
      'Error inviting member.',
      res
    );
  }
};

/**
 * POST /api/v1/companies/:id/members
 * Criar novo usuário ADMIN na empresa.
 * Cria User + vincula como ADMIN automaticamente.
 * Apenas OWNER pode criar (validado no middleware)
 */
export const createMember = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;
  const { name, email, password } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ error: 'Invalid company ID.' });

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

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ error: VALIDATION_MESSAGES.INVALID_EMAIL });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: VALIDATION_MESSAGES.WEAK_PASSWORD,
    });
  }

  try {
    const userCompany = await companyService.createMember(
      Number.parseInt(id),
      name,
      email,
      password
    );
    return res.status(201).json(userCompany);
  } catch (error) {
    return handleError(
      error,
      'Error creating member.',
      res
    );
  }
};
