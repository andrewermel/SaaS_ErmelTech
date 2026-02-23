import { Decimal } from '@prisma/client/runtime/library';

export interface Ingredient {
  id: number;
  name: string;
  weightG: number;
  cost: Decimal | string; // Decimal do Prisma ou string quando serializado
  createdAt: Date;
  updatedAt: Date;
}

export interface Portion {
  id: number;
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
  name: string;
  imageUrl?: string | null;
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
