import { Response } from "express";
import { isPrismaErrorCode, PrismaErrorCode } from "../types/index.js";

export const handlePrismaError = (error: unknown, res: Response): Response => {
  if (isPrismaErrorCode(error, PrismaErrorCode.UNIQUE_CONSTRAINT)) {
    return res.status(409).json({ error: "Already exists." });
  }

  if (isPrismaErrorCode(error, PrismaErrorCode.NOT_FOUND)) {
    return res.status(404).json({ error: "Not found." });
  }

  if (isPrismaErrorCode(error, PrismaErrorCode.FK_CONSTRAINT)) {
    return res.status(400).json({ error: "Invalid reference." });
  }

  return res.status(500).json({ error: "Internal server error." });
};

export const handleError = (
  error: unknown,
  defaultMessage: string,
  res: Response,
): Response => {
  if (error instanceof Error) {
    if (error.message.includes("in use")) {
      return res.status(409).json({ error: error.message });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
  }

  return handlePrismaError(error, res);
};
