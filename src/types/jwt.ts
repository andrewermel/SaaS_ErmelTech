export interface JwtPayload {
  userId: number;
  email: string;
  companyId?: number; // opcional - só existe se usuário tem empresa
  role?: string; // opcional - "OWNER" | "ADMIN" | "EMPLOYEE"
}
