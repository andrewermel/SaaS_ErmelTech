import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/errorHandler.js';
import {
  sendValidationError,
  validateRequired,
} from '../helpers/validators.js';
import prisma from '../lib/prisma.js';
import type { JwtPayload } from '../types/index.js';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  const emailError = validateRequired(email, 'Email');
  if (emailError)
    return sendValidationError(emailError, res);

  const passwordError = validateRequired(
    password,
    'Password'
  );
  if (passwordError)
    return sendValidationError(passwordError, res);

  const normalizedEmail = email.toLowerCase().trim();

  if (!emailRegex.test(normalizedEmail)) {
    return res
      .status(400)
      .json({ error: 'Invalid email format.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: 'Invalid password.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ error: 'JWT secret not configured.' });
    }

    // Buscar associação do usuário com empresa (se houver)
    const userCompany = await prisma.userCompany.findFirst({
      where: { userId: user.id },
      include: { company: true },
    });

    if (!userCompany)
      return res.status(400).json({
        error: 'User not assigned to company.',
      });

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      companyId: userCompany.companyId,
      role: userCompany.role,
    };

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn: '1h',
    });

    return res.json({
      token,
      company: userCompany?.company ?? null,
    });
  } catch (error) {
    return handleError(error, 'Login error.', res);
  }
};
