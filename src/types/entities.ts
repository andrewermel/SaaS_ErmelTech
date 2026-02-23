import { Decimal } from '@prisma/client/runtime/library';

export interface Ingredient {
  id: number;
  companyId?: number | null;
  name: string;
  weightG: number;
  cost: Decimal | string; // Decimal do Prisma ou string quando serializado
  createdAt: Date;
  updatedAt: Date;
}

export interface Portion {
  id: number;
  companyId?: number | null;
  name: string;
  weightG: number;
  cost: Decimal | string;
  ingredientId: number;
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
  companyId?: number | null;
  name: string;
  imageUrl?: string | null;
  snackPortions?: SnackPortion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

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
  createdAt: Date;
  user?: User;
  company?: Company;
}

// Helper type retornado pela API com totais calculados
export interface SnackWithTotals extends Snack {
  portions: PortionWithQuantity[];
  totalCost: string;
  totalWeightG: number;
  suggestedPrice: string;
}
