export interface PrismaError extends Error {
  code?: string;
}

export enum PrismaErrorCode {
  UNIQUE_CONSTRAINT = "P2002",
  NOT_FOUND = "P2025",
  FK_CONSTRAINT = "P2003",
}

export function isPrismaError(error: unknown): error is PrismaError {
  return error instanceof Error && "code" in error;
}

export function isPrismaErrorCode(
  error: unknown,
  code: PrismaErrorCode,
): error is PrismaError {
  return isPrismaError(error) && error.code === code;
}
