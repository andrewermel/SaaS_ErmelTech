export interface JwtPayload {
  userId: number;
  email: string;
  companyId?: number; // opcional - só existe se usuário tem empresa
  companyName?: string; // opcional - nome da empresa
  companySlug?: string; // opcional - slug da empresa para acesso ao cardápio público
  role?: string; // opcional - "OWNER" | "ADMIN" | "EMPLOYEE"
}
