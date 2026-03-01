import { Decimal } from '@prisma/client/runtime/library';

// ─── Roles & Multi-tenancy ───
export type Role = 'OWNER' | 'ADMIN' | 'EMPLOYEE';

export interface Company {
  id: number;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCompany {
  id: number;
  userId: number;
  companyId: number;
  role: Role;
  company?: Company;
  createdAt: Date;
}

// ─── Entidades existentes ───
export interface Ingredient {
  id: number;
  name: string;
  weightG: number;
  cost: Decimal | string;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portion {
  id: number;
  name: string;
  weightG: number;
  cost: Decimal | string;
  ingredientId: number;
  companyId: number;
  ingredient?: Ingredient;
  createdAt: Date;
  updatedAt: Date;
}

export interface SnackPortion {
  id: number;
  snackId: number;
  portionId: number;
  quantity: number;
  portion?: Portion;
  createdAt: Date;
}

export interface PortionWithQuantity extends Portion {
  quantity: number;
}

export interface Snack {
  id: number;
  name: string;
  imageUrl?: string | null;
  companyId: number;
  snackPortions?: SnackPortion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper type retornado pela API com totais calculados
export interface SnackWithTotals extends Snack {
  portions: PortionWithQuantity[];
  totalCost: string;
  totalWeightG: number;
  suggestedPrice: string;
}
