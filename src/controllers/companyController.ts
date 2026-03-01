import { Request, Response } from 'express';
import { handleError } from '../helpers/errorHandler.js';
import {
  sendValidationError,
  validateRequired,
} from '../helpers/validators.js';
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
      parseInt(id)
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
      parseInt(id),
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
      parseInt(id)
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
