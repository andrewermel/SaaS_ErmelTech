import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma.js";
import type { Ingredient, Portion } from "../types/entities.js";

const calculatePortionCost = (
  ingredientCost: Decimal,
  ingredientWeightG: number,
  portionWeightG: number,
): Decimal => {
  return ingredientCost
    .div(new Decimal(ingredientWeightG))
    .mul(new Decimal(portionWeightG));
};

export class PortionService {
  async create(
    ingredientId: number,
    name: string,
    weightG: number,
    companyId: number,
  ): Promise<Portion> {
    // Verificar que o ingrediente pertence à MESMA empresa
    const ingredient = await prisma.ingredient.findFirst({
      where: { id: ingredientId, companyId },
    });
    if (!ingredient) {
      throw new Error('Ingredient not found or does not belong to this company.');
    }

    const cost = calculatePortionCost(
      ingredient.cost as Decimal,
      ingredient.weightG,
      weightG,
    );

    return prisma.portion.create({
      data: {
        ingredientId,
        name: name.trim(),
        weightG,
        cost,
        companyId,
      },
    }) as any;
  }

  async findAll(companyId: number): Promise<(Portion & { ingredient: Ingredient })[]> {
    return prisma.portion.findMany({
      where: { companyId },
      include: { ingredient: true },
    }) as any;
  }

  async findById(id: number, companyId: number) {
    return prisma.portion.findFirst({
      where: { id, companyId },
      include: { ingredient: true },
    }) as Promise<(Portion & { ingredient: Ingredient }) | null>;
  }

  async update(
    id: number,
    data: { name?: string; weightG?: number },
    companyId: number,
  ): Promise<Portion & { ingredient: Ingredient }> {
    const existing = await prisma.portion.findFirst({
      where: { id, companyId },
      include: { ingredient: true },
    });
    if (!existing) throw new Error('Portion not found.');

    const updateData: {
      name?: string;
      weightG?: number;
      cost?: Decimal;
    } = {};

    if (data.name) updateData.name = data.name.trim();
    if (data.weightG !== undefined) updateData.weightG = data.weightG;

    if (data.weightG !== undefined) {
      const newCost = calculatePortionCost(
        (existing as any).ingredient.cost as Decimal,
        (existing as any).ingredient.weightG,
        data.weightG,
      );
      updateData.cost = newCost;
    }

    return prisma.portion.update({
      where: { id },
      data: updateData,
      include: { ingredient: true },
    }) as any;
  }

  async delete(id: number, companyId: number): Promise<{ message: string }> {
    const existing = await prisma.portion.findFirst({
      where: { id, companyId },
    });
    if (!existing) throw new Error('Portion not found.');

    const snackPortions = await prisma.snackPortion.findMany({
      where: { portionId: id },
    });

    if (snackPortions.length > 0) {
      throw new Error("Portion is in use by snacks.");
    }

    await prisma.portion.delete({ where: { id } });
    return { message: "Deleted." };
  }
}
