import { Response } from "express";

export interface ValidationError {
  status: number;
  message: string;
}

export const validateRequired = (
  value: unknown,
  field: string,
): ValidationError | null => {
  if (value === undefined || value === null || value === "") {
    return { status: 400, message: `${field} is required.` };
  }
  return null;
};

export const validatePositive = (
  value: number,
  field: string,
): ValidationError | null => {
  if (value <= 0) {
    return { status: 400, message: `${field} must be positive.` };
  }
  return null;
};

export const validateNonNegative = (
  value: number,
  field: string,
): ValidationError | null => {
  if (value < 0) {
    return { status: 400, message: `${field} must be non-negative.` };
  }
  return null;
};

export const sendValidationError = (
  error: ValidationError,
  res: Response,
): Response => {
  return res.status(error.status).json({ error: error.message });
};
