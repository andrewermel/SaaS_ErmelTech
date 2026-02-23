import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma.js";
import type { Ingredient } from "../types/entities.js";

export class IngredientService {
  async create(
    name: string,
    weightG: number,
    cost: number,
  ): Promise<Ingredient> {
    return prisma.ingredient.create({
      data: {
        name: name.trim(),
        weightG,
        cost: new Decimal(cost),
      },
    }) as any;
  }

  async findAll(): Promise<Ingredient[]> {
    return prisma.ingredient.findMany() as any;
  }

  async findById(id: number): Promise<Ingredient | null> {
    return prisma.ingredient.findUnique({ where: { id } }) as any;
  }

  async update(
    id: number,
    data: { name?: string; weightG?: number; cost?: number },
  ): Promise<Ingredient> {
    const updateData: {
      name?: string;
      weightG?: number;
      cost?: Decimal;
    } = {};

    if (data.name) updateData.name = data.name.trim();
    if (data.weightG !== undefined) updateData.weightG = data.weightG;
    if (data.cost !== undefined) updateData.cost = new Decimal(data.cost);

    return prisma.ingredient.update({ where: { id }, data: updateData }) as any;
  }

  async delete(id: number): Promise<Ingredient> {
    return prisma.ingredient.delete({ where: { id } }) as any;
  }
}
