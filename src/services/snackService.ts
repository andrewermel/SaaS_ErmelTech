import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../lib/prisma.js';

import { SnackWithTotals } from '../types/entities.js';

import type { Portion } from '../types/entities.js';

interface TotalsResult {
  totalCost: string;
  totalWeightG: number;
  suggestedPrice: string;
}

const calculateTotals = (
  snackPortions: Array<{
    portion: Portion;
    quantity: number;
  }>
): TotalsResult => {
  const totalCostDecimal = snackPortions.reduce(
    (sum: Decimal, sp) =>
      sum.plus(
        new Decimal(String(sp.portion.cost)).mul(
          sp.quantity
        )
      ),
    new Decimal(0)
  );
  return {
    totalCost: totalCostDecimal.toFixed(4),
    totalWeightG: snackPortions.reduce(
      (s: number, sp) =>
        s + sp.portion.weightG * sp.quantity,
      0
    ),
    suggestedPrice: totalCostDecimal
      .mul(new Decimal(2))
      .toFixed(4),
  };
};

export class SnackService {
  async createSnack(name: string, imageUrl?: string) {
    return prisma.snack.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null,
      },
      include: {
        snackPortions: { include: { portion: true } },
      },
    }) as any;
  }

  async getSnackWithTotals(
    snackId: number
  ): Promise<SnackWithTotals | null> {
    const snack = await prisma.snack.findUnique({
      where: { id: snackId },
      include: {
        snackPortions: { include: { portion: true } },
      },
    });

    if (!snack) return null;

    const { totalCost, totalWeightG, suggestedPrice } =
      calculateTotals(
        snack.snackPortions.map(sp => ({
          portion: sp.portion as Portion,
          quantity: sp.quantity,
        }))
      );

    const portions = snack.snackPortions.map(sp => ({
      ...(sp.portion as Portion),
      quantity: sp.quantity,
    }));

    return {
      id: snack.id,
      name: snack.name,
      imageUrl: snack.imageUrl,
      portions,
      totalCost,
      totalWeightG,
      suggestedPrice,
      createdAt: snack.createdAt,
      updatedAt: snack.updatedAt,
    };
  }

  async getAllSnacks(): Promise<SnackWithTotals[]> {
    const snacks = await prisma.snack.findMany({
      include: {
        snackPortions: { include: { portion: true } },
      },
    });

    return snacks.map(snack => {
      const { totalCost, totalWeightG, suggestedPrice } =
        calculateTotals(
          snack.snackPortions.map(sp => ({
            portion: sp.portion as Portion,
            quantity: sp.quantity,
          }))
        );

      const portions = snack.snackPortions.map(sp => ({
        ...(sp.portion as Portion),
        quantity: sp.quantity,
      }));

      return {
        id: snack.id,
        name: snack.name,
        imageUrl: snack.imageUrl,
        portions,
        totalCost,
        totalWeightG,
        suggestedPrice,
        createdAt: snack.createdAt,
        updatedAt: snack.updatedAt,
      };
    });
  }

  async addPortion(snackId: number, portionId: number) {
    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        await tx.snack.findUniqueOrThrow({
          where: { id: snackId },
        });
        await tx.portion.findUniqueOrThrow({
          where: { id: portionId },
        });

        const existing = await tx.snackPortion.findUnique({
          where: {
            snackId_portionId: { snackId, portionId },
          },
        });

        if (existing) {
          return tx.snackPortion.update({
            where: {
              snackId_portionId: { snackId, portionId },
            },
            data: { quantity: existing.quantity + 1 },
          }) as any;
        }

        return tx.snackPortion.create({
          data: { snackId, portionId, quantity: 1 },
        }) as any;
      }
    );
  }

  async removePortion(
    snackId: number,
    portionId: number
  ): Promise<{ message: string }> {
    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const snackPortion =
          await tx.snackPortion.findUnique({
            where: {
              snackId_portionId: { snackId, portionId },
            },
          });

        if (!snackPortion) {
          throw new Error('Portion not found in snack.');
        }

        if (snackPortion.quantity > 1) {
          await tx.snackPortion.update({
            where: {
              snackId_portionId: { snackId, portionId },
            },
            data: { quantity: snackPortion.quantity - 1 },
          });
        } else {
          await tx.snackPortion.delete({
            where: {
              snackId_portionId: { snackId, portionId },
            },
          });
        }

        return { message: 'Portion removed.' };
      }
    );
  }

  async deleteSnack(snackId: number) {
    return prisma.snack.delete({
      where: { id: snackId },
    }) as any;
  }
}
