import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma.js";
import type { Ingredient } from "../types/entities.js";

export class IngredientService {
  async create(
    name: string,
    weightG: number,
    cost: number,
    companyId: number,
  ): Promise<Ingredient> {
    return prisma.ingredient.create({
      data: {
        name: name.trim(),
        weightG,
        cost: new Decimal(cost),
        companyId,
      },
    }) as any;
  }

  async findAll(companyId: number): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({
      where: { companyId },
    }) as any;
  }

  async findById(id: number, companyId: number): Promise<Ingredient | null> {
    return prisma.ingredient.findFirst({
      where: { id, companyId },
    }) as any;
  }

  async update(
    id: number,
    data: { name?: string; weightG?: number; cost?: number },
    companyId: number,
  ): Promise<Ingredient> {
    const existing = await prisma.ingredient.findFirst({
      where: { id, companyId },
    });
    if (!existing) throw new Error('Ingredient not found.');

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

  async delete(id: number, companyId: number): Promise<Ingredient> {
    const existing = await prisma.ingredient.findFirst({
      where: { id, companyId },
    });
    if (!existing) throw new Error('Ingredient not found.');

    return prisma.ingredient.delete({ where: { id } }) as any;
  }
}
