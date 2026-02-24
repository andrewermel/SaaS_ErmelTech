import { Request, Response } from 'express';
import { handleError } from '../helpers/errorHandler.js';
import {
  sendValidationError,
  validateRequired,
} from '../helpers/validators.js';
import prisma from '../lib/prisma.js';
import { CompanyService } from '../services/companyService.js';
import type { JwtPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const companyService = new CompanyService();

export const createCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, phone } = req.body;

  const nameError = validateRequired(name, 'Name');
  if (nameError) return sendValidationError(nameError, res);

  try {
    const company = await companyService.create(
      name,
      email,
      phone
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

export const getCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res
      .status(400)
      .json({ error: 'Invalid company id.' });
  }

  try {
    const company = await companyService.findById(id);
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

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res
      .status(400)
      .json({ error: 'Invalid company id.' });
  }

  const user = req.user;
  if (!user)
    return res.status(401).json({ error: 'Unauthorized.' });
  if (user.companyId !== id)
    return res
      .status(403)
      .json({ error: 'Access denied.' });
  if (!['OWNER', 'ADMIN'].includes(user.role ?? '')) {
    return res
      .status(403)
      .json({ error: 'Insufficient role.' });
  }

  const { name, email, phone } = req.body;

  try {
    const updated = await companyService.update(id, {
      name,
      email,
      phone,
    });
    return res.json(updated);
  } catch (error) {
    return handleError(
      error,
      'Error updating company.',
      res
    );
  }
};

export const getMembers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res
      .status(400)
      .json({ error: 'Invalid company id.' });
  }

  const user = req.user;
  if (!user)
    return res.status(401).json({ error: 'Unauthorized.' });
  if (user.companyId !== id)
    return res
      .status(403)
      .json({ error: 'Access denied.' });

  try {
    const members = await companyService.getMembers(id);
    return res.json(members);
  } catch (error) {
    return handleError(
      error,
      'Error fetching members.',
      res
    );
  }
};

export const inviteMember = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res
      .status(400)
      .json({ error: 'Invalid company id.' });
  }

  const { email, role } = req.body;
  const emailError = validateRequired(email, 'Email');
  if (emailError)
    return sendValidationError(emailError, res);

  const user = req.user;
  if (!user)
    return res.status(401).json({ error: 'Unauthorized.' });
  if (user.companyId !== id)
    return res
      .status(403)
      .json({ error: 'Access denied.' });
  if (!['OWNER', 'ADMIN'].includes(user.role ?? '')) {
    return res
      .status(403)
      .json({ error: 'Insufficient role to invite.' });
  }

  try {
    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();
    const foundUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!foundUser)
      return res.status(404).json({
        error: 'User not found. Ask them to register.',
      });

    try {
      const membership = await companyService.addUser(
        id,
        foundUser.id,
        role ?? 'EMPLOYEE'
      );
      return res.status(201).json(membership);
    } catch (e: unknown) {
      // possible unique constraint violation
      const errorMessage =
        e instanceof Error
          ? e.message
          : 'Error adding member.';
      return res.status(400).json({
        error: errorMessage,
      });
    }
  } catch (error) {
    return handleError(
      error,
      'Error inviting member.',
      res
    );
  }
};
