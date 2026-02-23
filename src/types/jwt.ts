export interface JwtPayload {
  userId: number;
  email: string;
  companyId?: number;
  role?: string;
}
